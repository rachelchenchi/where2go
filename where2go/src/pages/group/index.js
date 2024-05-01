import Head from "next/head";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  const [groupUrl, setGroupUrl] = useState("");
  const [groupName, setGroupName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
        const fetchedGroups = await db.getGroups(user.uid);
        setGroups(fetchedGroups);
      } else {
        setGroups([]);
      }
    };
    fetchGroups();
  }, [user]);

  const handleGroupCreated = (newgroup) => {
    setGroups((prevGroups) => [...prevGroups, newgroup]);
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

  const handleGroupJoined = (newgroup) => {
    setGroups((prevGroups) => [...prevGroups, newgroup]);
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
            <form onSubmit={(event) => handleGroupJoined(event)}>
              <div className="field has-addons">
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    name="classCodeInput"
                    placeholder="Group Url"
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
            <form onSubmit={(event) => handleGroupCreated(event)}>
              <div className="field">
                <label class="label">What is this group about?</label>
                <p className="control">
                  <input
                    className="input"
                    type="text"
                    name="classCodeInput"
                    placeholder="Enter Group Name"
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
                        onChange={(date) => setStartDate(date)}
                      />
                      <p class="help is-success">Choose a start date</p>
                    </div>
                    <div className="column">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
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
            <th>Member</th>
            <th>Event Date</th>
            <th>Date created</th>
          </thead>
          <tbody>
            {groups.map((group, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Link href={`/app/${group.id}`}>{group.name}</Link>
                  </td>
                  <td>
                    <p>{group.owner}</p>
                  </td>
                  <td>
                    <p>{group.member}</p>
                  </td>
                  <td>
                    {group.createdAt
                      ? new Date(group.createdAt).toString()
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
