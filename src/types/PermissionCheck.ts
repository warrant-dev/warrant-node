export default interface PermissionCheck {
    permissionId: string;
    userId: string;
    consistentRead?: boolean;
    debug?: boolean;
}
