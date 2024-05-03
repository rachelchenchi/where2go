import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as db from "../../database";

const EditGroupModal = ({
  isOpen,
  onClose,
  onGroupUpdated,
  onDeleteGroup,
  group,
}) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (group) {
      setGroupName(group.groupName || "");
      setMembers(group.members || []);
      console.log(group.id);
    }
  }, [group]);

  const handleDeleteMember = (memberId) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.userId !== memberId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      groupName,
      members,
      membersId: members.map((member) => member.userId),
    };

    try {
      await db.updateGroup(group.id, updatedData);
      if (onGroupUpdated) {
        onGroupUpdated(group.id, updatedData);
      }
      onClose();
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await db.deleteGroup(group.id);
      onDeleteGroup(group); // Assume onDeleteGroup is a prop function handling UI update after deletion
      onClose();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Manage Group</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Edit Group Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Enter Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
            <label className="label">Members</label>
            <div className="field is-grouped is-multiline">
              {members
                .filter((member) => member.role === "member")
                .map((member, index) => (
                  <div className="control">
                    <div key={member.userId} className="tags has-addons">
                      <span className="tag is-link">{member.userName}</span>
                      <a
                        className="tag is-delete"
                        onClick={() => handleDeleteMember(member.userId)}
                      ></a>
                    </div>
                  </div>
                ))}
            </div>
          </form>
        </section>
        <div className="modal-card-foot buttons">
          <button className="button is-success" onClick={handleSubmit}>
            Save Changes
          </button>
          <button className="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button is-danger" onClick={handleDeleteGroup}>
            Delete Group
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditGroupModal;
