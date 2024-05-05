import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import * as db from "../../database";

import EditGroupModal from "../../components/PopUp/EditGroup";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Group = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  const [groupUrl, setGroupUrl] = useState("");
  const [groupName, setGroupName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    console.log("User state changed");
    if (!user) {
      alert("You have to sign in first");
      router.push("/login");
    }
  }, []);

  const fetchGroups = async () => {
    if (user) {
      const fetchedGroups = await db.getAllGroups(user.uid);
      setGroups(fetchedGroups);
    } else {
      setGroups([]);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const handleGroupCreated = async (event) => {
    event.preventDefault();
    try {
      const member = {
        userName: user.displayName,
        userId: user.uid,
        role: "owner",
      };
      const groupData = {
        groupName: groupName,
        startDate: startDate,
        endDate: endDate,
        ownerId: user.uid,
        membersId: [user.uid],
        members: [member],
        createdAt: Date.now(),
      };
      await db.createGroup(groupData);
      console.log("Group created successfully");
      await fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
    }
    // setGroups((prevGroups) => [...prevGroups, newgroup]);
  };

  const handleGroupJoined = async (event) => {
    // setGroups((prevGroups) => [...prevGroups, newgroup]);
    event.preventDefault();
    try {
      // parse the url for groupId:
      // `${baseUrl}/where2go/src/pages/group/${groupId}.js`;
      const pathname = new URL(groupUrl).pathname;
      const segments = pathname.split("/");
      const groupId = segments[segments.length - 1];

      console.log("Parsing groupId: ", groupId);

      const groupData = await db.getGroup(groupId);

      // check if current user is already a member:
      if (groupData.members.some((member) => member.userId === user.uid)) {
        console.log("User already a member of the group.");
        alert("You are already a member of the group.");
        return;
      }

      // add a member in members array with
      const newMember = {
        userName: user.displayName,
        userId: user.uid,
        role: "member",
      };

      // add user.uid to membersId array, the rest are the same
      const updatedMembers = [...groupData.members, newMember];
      const updatedMembersId = [...groupData.membersId, user.uid];

      const updatedData = {
        ...groupData,
        members: updatedMembers,
        membersId: updatedMembersId,
      };
      await db.updateGroup(groupId, updatedData);
      console.log("Group joined successfully");
      await fetchGroups();
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleGroupDeleted = async (group) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete the group?"
    );

    if (userConfirmed) {
      try {
        await db.deleteGroup(group.id, user.uid);
        console.log("You have deleted the group.");
        await fetchGroups();
      } catch (error) {
        console.error("Error deleting group:", error);
        alert("Failed to delete the group."); // Notify user about the error
      }
    } else {
      console.log("User decided not to delete the group.");
    }
  };

  const handleGroupUpdated = async (groupId, updatedData) => {
    try {
      await db.updateGroup(groupId, updatedData);
      console.log("Group updated successfully");
      await fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      alert("Failed to delete the group."); // Notify user about the error
    }
  };

  const onCopyGroupUrl = async (groupId) => {
    const baseUrl = window.location.origin;
    const groupUrl = `${baseUrl}/group/${groupId}`;

    try {
      await navigator.clipboard.writeText(groupUrl);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      alert("Failed to copy URL");
    }
  };

  const onManageGroup = (group) => {
    setEditGroup(group);
    setIsEditModalOpen(true);
  };

  const onLeaveGroup = async (group) => {
    // Ask user to confirm if they really want to leave the group
    const userConfirmed = window.confirm(
      "Are you sure you want to leave the group?"
    );

    if (userConfirmed) {
      try {
        const groupData = await db.getGroup(group.id);

        if (groupData) {
          // Filter out the leaving user from the members array
          const updatedMembers = groupData.members.filter(
            (member) => member.userId !== user.uid
          );
          const updatedMembersId = groupData.membersId.filter(
            (memberId) => memberId !== user.uid
          );

          // Update the group's 'members' and 'membersId' fields
          await db.updateGroup(group.id, {
            members: updatedMembers,
            membersId: updatedMembersId,
          });
          console.log("You have left the group.");
          await fetchGroups();
        } else {
          console.error("No such group exists.");
          alert("Failed to leave the group."); // Notify user if group does not exist
        }
      } catch (error) {
        console.error("Error leaving group:", error);
        alert("Failed to leave the group."); // Notify user about the error
      }
    } else {
      console.log("User decided not to leave the group.");
    }
  };

  return (
    <>
      <Head>
        <title>Group Space</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/hands-up.png" />
      </Head>
      <section className="container">
        <h1 style={{ marginTop: "20px", display: "flex", justifyContent: "center" }} className="title">Group Space</h1>

        <div className="columns">
          <div className="column is-one-third">
            <h1 className="title is-size-4">Join Existing Group</h1>
            <form onSubmit={handleGroupJoined}>
              <div className="field has-addons">
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Group Url"
                    value={groupUrl}
                    onChange={(e) => setGroupUrl(e.target.value)}
                  />
                </p>
                <p className="control">
                  <button className="button is-primary">Join</button>
                </p>
              </div>
              <p className="help is-success">Paste the group url here</p>
            </form>
          </div>
          <div className="column is">
            <h1 className="title is-size-4">Plan a New Event</h1>
            <form onSubmit={handleGroupCreated}>
              <div className="field">
                <label className="label">What is this group about?</label>
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    value={groupName}
                    placeholder="Enter Group Name"
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </p>
              </div>
              <div className="field">
                <label className="label">What date might work?</label>
                <div className="control">
                  <div className="columns">
                    <div className="column is-one-quarter">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date.valueOf())}
                      />
                      <p className="help is-success">Choose a start date</p>
                    </div>
                    <div className="column is-1">-</div>
                    <div className="column is-one-quarter">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                          if (date.valueOf() < startDate.valueOf()) {
                            alert(
                              "End date cannot be earlier than start date."
                            );
                            return;
                          }
                          setEndDate(date.valueOf());
                        }}
                        minDate={startDate} // Disable all dates before the start date
                      />
                      <p className="help is-success">Choose an end date</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field">
                <p className="control">
                  <button className="button is-primary">Create</button>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div>
          {isEditModalOpen && (
            <EditGroupModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              group={editGroup}
              onGroupUpdated={handleGroupUpdated}
              onDeleteGroup={handleGroupDeleted}
            />
          )}
        </div>
      </section>
      <section className="container">
        <div className="title is-size-4">View Active Groups</div>
        <table className="table">
          <thead>
            <tr>
            <th>Group</th>
            <th>Owner</th>
            <th>Members</th>
            <th>Event Date</th>
            <th>Date created</th>
            {/* <th>Delete?</th> */}
            </tr>
          </thead>
          <tbody>
            {groups?.map((group, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Link href={`/group/${group.id}`}>{group.groupName}</Link>
                  </td>
                  <td>
                    {group.members.map((member, index) => {
                      return member.role === "owner" ? member.userName : "";
                    })}
                  </td>
                  <td>
                    {group.members
                      .filter((member) => member.role === "member")
                      .map((member) => member.userName)
                      .join(", ")}
                  </td>
                  <td>
                    {new Date(group.startDate).toLocaleDateString() ===
                    new Date(group.endDate).toLocaleDateString()
                      ? new Date(group.startDate).toLocaleDateString()
                      : `${new Date(
                          group.startDate
                        ).toLocaleDateString()} - ${new Date(
                          group.endDate
                        ).toLocaleDateString()}`}
                  </td>
                  <td>
                    {group.createdAt
                      ? new Date(group.createdAt).toLocaleDateString()
                      : "No date"}
                  </td>
                  <td>
                    <button
                      className="button is-info"
                      onClick={() => onCopyGroupUrl(group.id)}
                    >
                      Copy URL
                    </button>
                  </td>
                  <td>
                    {group.ownerId === user?.uid ? (
                      <button
                        className="button is-primary"
                        onClick={() => onManageGroup(group)}
                      >
                        Manage
                      </button>
                    ) : (
                      <button
                        className="button is-danger"
                        onClick={() => onLeaveGroup(group)}
                      >
                        Leave
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div></div>
      </section>
    </>
  );
};

export default Group;
