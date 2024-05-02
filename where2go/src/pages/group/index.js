import Head from "next/head";
import firebaseApp from "../../firebase";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import EditGroupModal from "../../components/PopUp/EditGroup";
// import DeleteGroupModal from "../../components/PopUp/DeleteGroup";
// import GroupDisplay from "../../components/groups/GroupDisplay";
import * as db from "../../database_zx";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Group = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        const fetchedGroups = await db.getAllGroups(user.uid);
        setGroups(fetchedGroups);
      } else {
        setGroups([]);
      }
    };
    fetchGroups();
  }, [user]);

  const handleGroupCreated = async (event) => {
    event.preventDefault();
    try {
      const currentUser = getAuth(firebaseApp).currentUser;
      const userId = currentUser ? currentUser.uid : null;
      const userName = currentUser ? currentUser.displayName : null;

      const member = {
        userName: userName,
        userId: userId,
        role: "owner",
      };
      const groupData = {
        groupName: groupName,
        startDate: startDate,
        endDate: endDate,
        ownerId: userId,
        membersId: [userId],
        members: [member],
        createdAt: Date.now(),
      };
      await db.createGroup(groupData);
      console.log("Group created successfully");
    } catch (error) {
      console.error("Error creating group:", error);
    }
    // setGroups((prevGroups) => [...prevGroups, newgroup]);
  };

  const handleGroupJoined = async (event) => {
    // setGroups((prevGroups) => [...prevGroups, newgroup]);
    event.preventDefault();
    // try {
    //   const currentUser = getAuth(firebaseApp).currentUser;
    //   const userId = currentUser ? currentUser.uid : null;

    //   const groupData = {
    //     groupName: groupName,
    //     owner: userId

    //   }
    // } catch (error) {
    //   console.error('Error creating group:', error);
    // }
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

  const handleEditGroup = (group) => {
    setEditGroup(group);
    setIsEditModalOpen(true);
  };

  const handleGroupUpdated = (groupId, updatedData) => {
    setPlaces((prevGroups) =>
      prevGroups.map((group) => {
        return group.id === groupId ? { ...group, ...updatedData } : group;
      })
    );
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
                    <div className="column">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date.valueOf())}
                      />
                      <p class="help is-success">Choose a start date</p>
                    </div>
                    <div className="column">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date.valueOf())}
                      />
                      <p class="help is-success">Choose an end date</p>
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
        {/* <div>
          {groups.map((group, index) => (
            <GroupDisplay
              key={index}
              place={place}
              onDelete={handleDeletePlace}
              onEdit={() => handleEditPlace(place)}
            />
          ))}
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
            <th>Delete?</th>
          </thead>
          <tbody>
            {groups.map((group, index) => {
              return (
                <tr key={index}>
                  <td>
                    {/* <Link href={`/app/${group.id}`}>{group.name}</Link> */}
                    {group.groupName}
                  </td>
                  <td>
                    {group.members.map((member, index) => {
                      return member.role === 'owner' ? member.userName : '';
                    })}
                  </td>
                  <td>
                    {group.members.map((member, index) => {
                      return member.userName;
                    })}
                  </td>
                  <td>
                    {new Date(group.startDate).toLocaleDateString() === new Date(group.endDate).toLocaleDateString()
                      ? new Date(group.startDate).toLocaleDateString()
                      : `${new Date(group.startDate).toLocaleDateString()} - ${new Date(group.endDate).toLocaleDateString()}`}
                  </td>
                  <td>
                    {group.createdAt
                      ? new Date(group.createdAt).toLocaleDateString()
                      : "No date"}
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
