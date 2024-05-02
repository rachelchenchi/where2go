import Link from "next/link";

const GroupDisplay = ({
  group,
  onCopyGroupUrl,
  onManageGroup,
  onLeaveGroup,
  user,
}) => {
  return (
    <tr>
      <td>
        <Link href={`/group/${group.id}`}>{group.groupName}</Link>
      </td>
      <td>
        {group.members.find((member) => member.role === "owner")?.userName ||
          ""}
      </td>
      <td>{group.members.map((member) => member.userName).join(", ")}</td>
      <td>
        {new Date(group.startDate).toLocaleDateString() ===
        new Date(group.endDate).toLocaleDateString()
          ? new Date(group.startDate).toLocaleDateString()
          : `${new Date(group.startDate).toLocaleDateString()} - ${new Date(
              group.endDate
            ).toLocaleDateString()}`}
      </td>
      <td>{new Date(group.createdAt).toLocaleDateString()}</td>
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
            onClick={() => onManageGroup(group)}
          >
            Manage
          </button>
        ) : (
          <button
            className="button is-danger"
            onClick={() => onLeaveGroup(group.id)}
          >
            Leave
          </button>
        )}
      </td>
    </tr>
  );
};

export default GroupDisplay;
