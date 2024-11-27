Description:
Developed and deployed a robust Role-Based Access Control (RBAC) system, including a fully functional backend on Render and a responsive frontend on Netlify. Implemented secure authentication and authorization using cookies and JWT.

Features:-
- Roles
    Admin: Highest level of access, with specific restrictions for security and hierarchy.
    Moderator (Mod): Intermediate level of access with permissions granted by Admins.
    User: Basic access level, limited to viewing information.

Permissions:-
- Admin Permissions:
   Can add, edit, and delete users, except for other Admins.
   Can edit their own profile, but cannot modify other Admins.
   Can activate or deactivate user accounts (excluding Admins).
   Deactivating an account removes all permissions from the account, rendering it inactive.

- Mod Permissions:
   Can be granted write permissions by Admins.
   If granted write access, Mods can edit user details but cannot add new users or modify other Mods.

- User Permissions:
   Can only view the list of all users and their basic details.

