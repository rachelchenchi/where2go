import Head from "next/head";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EditGroupModal from "../../components/PopUp/EditGroup";

import * as db from "../../database";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";

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

  const handleDeleteGroup = async (groupId) => {
    try {
      await db.deleteGroup(groupId);
      setGroups((prevGroups) =>
        prevGroups.filter((allgroups) => allgroups.id !== groupId)
      );
    } catch (error) {
      console.error("Error deleting group:", error);
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
    const userConfirmed = window.confirm("Are you sure you want to leave the group?");
    
    if (userConfirmed) {
      try {
        await db.leaveGroup(group.id, user.uid);
        console.log('You have left the group.'); 
        await fetchGroups();  
      } catch (error) {
        console.error('Error leaving group:', error);
        alert('Failed to leave the group.');  // Notify user about the error
      }
    } else {
      console.log("User decided not to leave the group.");
    }
  };
  

  return (
    <>
      <Head>
        <title>Group Space</title>
      </Head>
      <section className="section">
        {/* <h1 className="title">Group Space</h1> */}

        <div className="columns">
          <div className="column is-one-third">
            <h1 className="title">Join Existing Group</h1>
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
              <p class="help is-success">Paste the group url here</p>
            </form>
          </div>
          <div className="column is">
            <h1 className="title">Plan a New Event</h1>
            <form onSubmit={handleGroupCreated}>
              <div className="field">
                <label class="label">What is this group about?</label>
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
                <label class="label">What date might work?</label>
                <p className="control">
                  <div className="columns">
                    <div className="column is-one-quarter">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date.valueOf())}
                      />
                      <p class="help is-success">Choose a start date</p>
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
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <button className="button is-primary">Create</button>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* <div>
                    <AddPlaceModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onPlaceAdded={handlePlaceAdded}
                    /></div>
                <div>
                    {isEditModalOpen && (
                        <EditPlaceModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            place={editPlace}
                            onPlaceUpdated={handlePlaceUpdated}
                        />
                    )}
                </div> */}
      </section>
      <section className="section">
        <div className="title is-3">View Active Groups</div>
        <table className="table">
          <thead>
            <th>Group</th>
            <th>Owner</th>
            <th>Members</th>
            <th>Event Date</th>
            <th>Date created</th>
            {/* <th>Delete?</th> */}
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
                    {group.members.map((member) => member.userName).join(", ")}
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
                    {group.ownerId === user.uid ? (
                      <button
                        className="button is-primary"
                        onClick={() => onManageGroup(group.id)}
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
      </section>
    </>
  );
};

export default Group;
