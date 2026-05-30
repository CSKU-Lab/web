export const mapUserColumnID = (columnID: string) => {
  switch (columnID) {
    case "id":
      return "ID";
    case "email":
      return "Email";
    case "username":
      return "Username";
    case "display_name":
      return "Display Name";
    case "profile_image":
      return "Profile Image";
    case "roles":
      return "Roles";
    case "type":
      return "Type";
    case "created_at":
      return "Created At";
    case "updated_at":
      return "Updated At";
    default:
      return columnID;
  }
};
