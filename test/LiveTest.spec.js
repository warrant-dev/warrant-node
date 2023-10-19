const { SelfServiceStrategy, WarrantClient } = require("../dist/index");
var assert = require('assert');

// Remove .skip and add your API_KEY to run tests
describe.skip('Live Test', function () {
    before(function () {
        this.warrant = new WarrantClient({ apiKey: "", endpoint: "https://api.warrant.dev" });
    });

    it('CRUD users', async function () {
        const user1 = await this.warrant.User.create();
        assert(user1.userId);
        assert.strictEqual(user1.meta, undefined);

        let user2 = await this.warrant.User.create({ userId: "zz_some_id", meta: { email: "test@email.com" } });
        let refetchedUser = await this.warrant.User.get(user2.userId, { warrantToken: "latest" });
        assert.strictEqual(user2.userId, refetchedUser.userId);
        assert.deepStrictEqual(user2.meta, { email: "test@email.com" });

        user2 = await this.warrant.User.update("zz_some_id", { email: "updated@email.com" });
        refetchedUser = await this.warrant.User.get("zz_some_id", { warrantToken: "latest" });
        assert.strictEqual(refetchedUser.userId, "zz_some_id");
        assert.deepStrictEqual(refetchedUser.meta, { email: "updated@email.com" });

        let usersList = await this.warrant.User.listUsers({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(usersList.results.length, 2);
        assert.strictEqual(usersList.results[0].userId, user1.userId);
        assert.strictEqual(usersList.results[1].userId, refetchedUser.userId);

        await this.warrant.User.delete(user1.userId);
        await this.warrant.User.delete(user2.userId);
        usersList = await this.warrant.User.listUsers({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(usersList.results.length, 0);
    });

    it('CRUD tenants', async function () {
        const tenant1 = await this.warrant.Tenant.create();
        assert(tenant1.tenantId);
        assert.strictEqual(tenant1.meta, undefined);

        let tenant2 = await this.warrant.Tenant.create({ tenantId: "zz_some_tenant_id", meta: { name: "new_name" } });
        let refetchedTenant = await this.warrant.Tenant.get(tenant2.tenantId, { warrantToken: "latest" });
        assert.strictEqual(tenant2.tenantId, refetchedTenant.tenantId);
        assert.deepStrictEqual(tenant2.meta, { name: "new_name" });

        tenant2 = await this.warrant.Tenant.update("zz_some_tenant_id", { name: "updated_name" });
        refetchedTenant = await this.warrant.Tenant.get("zz_some_tenant_id", { warrantToken: "latest" });
        assert.strictEqual(refetchedTenant.tenantId, "zz_some_tenant_id");
        assert.deepStrictEqual(refetchedTenant.meta, { name: "updated_name" });

        let tenantsList = await this.warrant.Tenant.listTenants({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(tenantsList.results.length, 2);
        assert.strictEqual(tenantsList.results[0].tenantId, tenant1.tenantId);
        assert.strictEqual(tenantsList.results[1].tenantId, refetchedTenant.tenantId);

        await this.warrant.Tenant.delete(tenant1.tenantId);
        await this.warrant.Tenant.delete(tenant2.tenantId);
        tenantsList = await this.warrant.Tenant.listTenants({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(tenantsList.results.length, 0);
    });

    it('CRUD roles', async function () {
        const adminRole = await this.warrant.Role.create({ roleId: "admin", meta: { name: "Admin", description: "The admin role" } });
        assert.strictEqual(adminRole.roleId, "admin");
        assert.deepStrictEqual(adminRole.meta, { name: "Admin", description: "The admin role" });

        let viewerRole = await this.warrant.Role.create({ roleId: "viewer", meta: { name: "Viewer", description: "The viewer role" } });
        let refetchedRole = await this.warrant.Role.get(viewerRole.roleId, { warrantToken: "latest" });
        assert.strictEqual(viewerRole.roleId, refetchedRole.roleId);
        assert.deepStrictEqual(viewerRole.meta, refetchedRole.meta);

        viewerRole = await this.warrant.Role.update("viewer", { name: "Viewer Updated", description: "Updated desc" });
        refetchedRole = await this.warrant.Role.get("viewer", { warrantToken: "latest" });
        assert.strictEqual(refetchedRole.roleId, "viewer");
        assert.deepStrictEqual(refetchedRole.meta, { name: "Viewer Updated", description: "Updated desc" });

        let rolesList = await this.warrant.Role.listRoles({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(rolesList.results.length, 2);
        assert.strictEqual(rolesList.results[0].roleId, "admin");
        assert.strictEqual(rolesList.results[1].roleId, "viewer");

        await this.warrant.Role.delete(adminRole.roleId);
        await this.warrant.Role.delete(viewerRole.roleId);
        rolesList = await this.warrant.Role.listRoles({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(rolesList.results.length, 0);
    });

    it('CRUD permissions', async function () {
        const permission1 = await this.warrant.Permission.create({ permissionId: "perm1", meta: { name: "Permission 1", description: "Permission with id 1" } });
        assert.strictEqual(permission1.permissionId, "perm1");
        assert.deepStrictEqual(permission1.meta, { name: "Permission 1", description: "Permission with id 1" });

        let permission2 = await this.warrant.Permission.create({ permissionId: "perm2", name: "Permission 2", description: "Permission with id 2" });
        let refetchedPermission = await this.warrant.Permission.get(permission2.permissionId, { warrantToken: "latest" });
        assert.strictEqual(permission2.permissionId, refetchedPermission.permissionId);
        assert.deepStrictEqual(permission2.meta, refetchedPermission.meta);

        permission2 = await this.warrant.Permission.update("perm2", { name: "Permission 2 Updated", description: "Updated desc" });
        refetchedPermission = await this.warrant.Permission.get("perm2", { warrantToken: "latest" });
        assert.strictEqual(refetchedPermission.permissionId, "perm2");
        assert.deepStrictEqual(refetchedPermission.meta, { name: "Permission 2 Updated", description: "Updated desc" });

        let permissionsList = await this.warrant.Permission.listPermissions({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(permissionsList.results.length, 2);
        assert.strictEqual(permissionsList.results[0].permissionId, "perm1");
        assert.strictEqual(permissionsList.results[1].permissionId, "perm2");

        await this.warrant.Permission.delete(permission1.permissionId);
        await this.warrant.Permission.delete(permission2.permissionId);
        permissionsList = await this.warrant.Permission.listPermissions({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(permissionsList.results.length, 0);
    });

    it('CRUD features', async function () {
        const feature1 = await this.warrant.Feature.create({ featureId: "new-feature", meta: { name: "New Feature" } });
        assert.strictEqual(feature1.featureId, "new-feature");
        assert.deepStrictEqual(feature1.meta, { name: "New Feature" });

        let feature2 = await this.warrant.Feature.create({ featureId: "feature-2" });
        let refetchedFeature = await this.warrant.Feature.get(feature2.featureId, { warrantToken: "latest" });
        assert.strictEqual(feature2.featureId, refetchedFeature.featureId);
        assert.deepStrictEqual(feature2.meta, refetchedFeature.meta);

        feature2 = await this.warrant.Feature.update("feature-2", { name: "Feature 2", description: "Second feature" });
        refetchedFeature = await this.warrant.Feature.get(feature2.featureId, { warrantToken: "latest" });
        assert.strictEqual(refetchedFeature.featureId, "feature-2");
        assert.deepStrictEqual(refetchedFeature.meta, { name: "Feature 2", description: "Second feature" });

        let featuresList = await this.warrant.Feature.listFeatures({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(featuresList.results.length, 2);
        assert.strictEqual(featuresList.results[0].featureId, refetchedFeature.featureId);
        assert.strictEqual(featuresList.results[1].featureId, feature1.featureId);

        await this.warrant.Feature.delete(feature1.featureId);
        await this.warrant.Feature.delete(feature2.featureId);
        featuresList = await this.warrant.Feature.listFeatures({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(featuresList.results.length, 0);
    });

    it('CRUD pricing tiers', async function () {
        const tier1 = await this.warrant.PricingTier.create({ pricingTierId: "new-tier-1", meta: { name: "New Pricing Tier" } });
        assert.strictEqual(tier1.pricingTierId, "new-tier-1");
        assert.deepStrictEqual(tier1.meta, { name: "New Pricing Tier" });

        let tier2 = await this.warrant.PricingTier.create({ pricingTierId: "tier-2" });
        let refetchedTier = await this.warrant.PricingTier.get(tier2.pricingTierId, { warrantToken: "latest" });
        assert.strictEqual(tier2.pricingTierId, refetchedTier.pricingTierId);
        assert.deepStrictEqual(tier2.meta, refetchedTier.meta);

        tier2 = await this.warrant.PricingTier.update("tier-2", { name: "Tier 2", description: "New pricing tier" });
        refetchedTier = await this.warrant.PricingTier.get(tier2.pricingTierId, { warrantToken: "latest" });
        assert.strictEqual(refetchedTier.pricingTierId, "tier-2");
        assert.deepStrictEqual(refetchedTier.meta, { name: "Tier 2", description: "New pricing tier" });

        let tiersList = await this.warrant.PricingTier.listPricingTiers({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(tiersList.results.length, 2);
        assert.strictEqual(tiersList.results[0].pricingTierId, tier1.pricingTierId);
        assert.strictEqual(tiersList.results[1].pricingTierId, tier2.pricingTierId);

        await this.warrant.PricingTier.delete(tier1.pricingTierId);
        await this.warrant.PricingTier.delete(tier2.pricingTierId);
        tiersList = await this.warrant.PricingTier.listPricingTiers({ limit: 10 }, { warrantToken: "latest" });
        assert.strictEqual(tiersList.results.length, 0);
    });

    it('batch create users and tenants', async function () {
        const newUsers = [
            { userId: "user-1" },
            { userId: "user-2", meta: { name: "User 2" }}
        ];
        const createdUsers = await this.warrant.User.batchCreate(newUsers);
        assert.strictEqual(createdUsers.length, 2);
        assert.strictEqual(createdUsers[0].userId, "user-1");
        assert.strictEqual(createdUsers[1].userId, "user-2");
        assert.deepStrictEqual(createdUsers[1].meta, { name: "User 2" });

        const newTenants = [
            { tenantId: "tenant-1" },
            { tenantId: "tenant-2", meta: { name: "Tenant 2" }}
        ];
        const createdTenants = await this.warrant.Tenant.batchCreate(newTenants);
        assert.strictEqual(createdTenants.length, 2);
        assert.strictEqual(createdTenants[0].tenantId, "tenant-1");
        assert.strictEqual(createdTenants[1].tenantId, "tenant-2");
        assert.deepStrictEqual(createdTenants[1].meta, { name: "Tenant 2" });

        await this.warrant.User.delete("user-1");
        await this.warrant.User.delete("user-2");
        await this.warrant.Tenant.delete("tenant-1");
        await this.warrant.Tenant.delete("tenant-2");
    });

    it('multi-tenancy example', async function () {
        // Create users
        const user1 = await this.warrant.User.create();
        const user2 = await this.warrant.User.create();

        // Create tenants
        const tenant1 = await this.warrant.Tenant.create({ tenantId: "tenant-1", meta: { name: "Tenant 1" }});
        const tenant2 = await this.warrant.Tenant.create({ tenantId: "tenant-2", meta: { name: "Tenant 2" }});

        let user1TenantsList = await this.warrant.Tenant.listTenantsForUser(user1.userId, { limit: 100 }, { warrantToken: "latest" });
        let tenant1UsersList = await this.warrant.User.listUsersForTenant("tenant-1", { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(user1TenantsList.results.length, 0);
        assert.strictEqual(tenant1UsersList.results.length, 0);

        // Assign user1 -> tenant1
        await this.warrant.User.assignUserToTenant(tenant1.tenantId, user1.userId, "member");

        user1TenantsList = await this.warrant.Tenant.listTenantsForUser(user1.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(user1TenantsList.results.length, 1);
        assert.strictEqual(user1TenantsList.results[0].tenantId, "tenant-1");
        assert.deepStrictEqual(user1TenantsList.results[0].meta, { name: "Tenant 1" });

        tenant1UsersList = await this.warrant.User.listUsersForTenant("tenant-1", { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(tenant1UsersList.results.length, 1);
        assert.strictEqual(tenant1UsersList.results[0].userId, user1.userId);
        assert.strictEqual(tenant1UsersList.results[0].meta, undefined);

        // Remove user1 -> tenant1
        await this.warrant.User.removeUserFromTenant(tenant1.tenantId, user1.userId, "member");

        user1TenantsList = await this.warrant.Tenant.listTenantsForUser(user1.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(user1TenantsList.results.length, 0);

        tenant1UsersList = await this.warrant.User.listUsersForTenant(tenant1.tenantId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(tenant1UsersList.results.length, 0);

        // Clean up
        await this.warrant.User.delete(user1.userId);
        await this.warrant.User.delete(user2.userId);
        await this.warrant.Tenant.delete(tenant1.tenantId);
        await this.warrant.Tenant.delete(tenant2.tenantId);
    });

    it('RBAC example', async function () {
        // Create users
        const adminUser = await this.warrant.User.create();
        const viewerUser = await this.warrant.User.create();

        // Create roles
        const adminRole = await this.warrant.Role.create({ roleId: "admin", meta: { name: "Admin", description: "The admin role" }});
        const viewerRole = await this.warrant.Role.create({ roleId: "viewer", meta: { name: "Viewer", description: "The viewer role" }});

        // Create permissions
        const createPermission = await this.warrant.Permission.create({ permissionId: "create-report", meta: { name: "Create Report", description: "Permission to create reports" }});
        const viewPermission = await this.warrant.Permission.create({ permissionId: "view-report", meta: { name: "View Report", description: "Permission to view reports" }});

        let adminUserRolesList = await this.warrant.Role.listRolesForUser(adminUser.userId, { limit: 100 }, { warrantToken: "latest" });
        let adminRolePermissionsList = await this.warrant.Permission.listPermissionsForRole(adminRole.roleId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(adminUserRolesList.results.length, 0);
        assert.strictEqual(adminRolePermissionsList.results.length, 0);

        let adminUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "create-report", subject: adminUser }, { warrantToken: "latest" });
        assert.strictEqual(adminUserHasPermission, false);

        // Assign 'create-report' -> admin role -> admin user
        await this.warrant.Permission.assignPermissionToRole(adminRole.roleId, createPermission.permissionId);
        await this.warrant.Role.assignRoleToUser(adminUser.userId, adminRole.roleId);

        adminUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "create-report", subject: adminUser }, { warrantToken: "latest" });
        assert.strictEqual(adminUserHasPermission, true);

        adminUserRolesList = await this.warrant.Role.listRolesForUser(adminUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(adminUserRolesList.results.length, 1);
        assert.strictEqual(adminUserRolesList.results[0].roleId, adminRole.roleId);
        assert.deepStrictEqual(adminUserRolesList.results[0].meta, { name: "Admin", description: "The admin role" });

        adminRolePermissionsList = await this.warrant.Permission.listPermissionsForRole(adminRole.roleId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(adminRolePermissionsList.results.length, 1);
        assert.strictEqual(adminRolePermissionsList.results[0].permissionId, createPermission.permissionId);
        assert.deepStrictEqual(adminRolePermissionsList.results[0].meta, { name: "Create Report", description: "Permission to create reports" });

        await this.warrant.Permission.removePermissionFromRole(adminRole.roleId, createPermission.permissionId);
        await this.warrant.Role.removeRoleFromUser(adminUser.userId, adminRole.roleId);

        adminUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "create-report", subject: adminUser });
        assert.strictEqual(adminUserHasPermission, false);

        adminUserRolesList = await this.warrant.Role.listRolesForUser(adminUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(adminUserRolesList.results.length, 0);

        adminRolePermissionsList = await this.warrant.Permission.listPermissionsForRole(adminRole.roleId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(adminRolePermissionsList.results.length, 0);

        // Assign 'view-report' -> viewer user
        let viewerUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "view-report", subject: viewerUser });
        assert.strictEqual(viewerUserHasPermission, false);

        let viewerUserPermissionsList = await this.warrant.Permission.listPermissionsForUser(viewerUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(viewerUserPermissionsList.results.length, 0);

        await this.warrant.Permission.assignPermissionToUser(viewerUser.userId, viewPermission.permissionId);

        viewerUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "view-report", subject: viewerUser }, { warrantToken: "latest" });
        assert.strictEqual(viewerUserHasPermission, true);

        viewerUserPermissionsList = await this.warrant.Permission.listPermissionsForUser(viewerUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(viewerUserPermissionsList.results.length, 1);
        assert.strictEqual(viewerUserPermissionsList.results[0].permissionId, viewPermission.permissionId);
        assert.deepStrictEqual(viewerUserPermissionsList.results[0].meta, { name: "View Report", description: "Permission to view reports" });

        await this.warrant.Permission.removePermissionFromUser(viewerUser.userId, viewPermission.permissionId);

        viewerUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "view-report", subject: viewerUser }, { warrantToken: "latest" });
        assert.strictEqual(viewerUserHasPermission, false);

        viewerUserPermissionsList = await this.warrant.Permission.listPermissionsForUser(viewerUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(viewerUserPermissionsList.results.length, 0);

        // Clean up
        await this.warrant.User.delete(adminUser.userId);
        await this.warrant.User.delete(viewerUser.userId);
        await this.warrant.Role.delete(adminRole.roleId);
        await this.warrant.Role.delete(viewerRole.roleId);
        await this.warrant.Permission.delete(createPermission.permissionId);
        await this.warrant.Permission.delete(viewPermission.permissionId);
    });

    it('pricing tiers, features, and users example', async function () {
        // Create users
        const freeUser = await this.warrant.User.create();
        const paidUser = await this.warrant.User.create();

        // Create pricing tiers
        const freeTier = await this.warrant.PricingTier.create({ pricingTierId: "free", meta: { name: "Free Tier" }});
        const paidTier = await this.warrant.PricingTier.create({ pricingTierId: "paid" });

        // Create features
        const customFeature = await this.warrant.Feature.create({ featureId: "custom-feature", meta: { name: "Custom Feature" }});
        const feature1 = await this.warrant.Feature.create({ featureId: "feature-1" });
        const feature2 = await this.warrant.Feature.create({ featureId: "feature-2" });

        // Assign 'custom-feature' -> paid user
        let paidUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidUser }, { warrantToken: "latest" });
        assert.strictEqual(paidUserHasFeature, false);

        let paidUserFeaturesList = await this.warrant.Feature.listFeaturesForUser(paidUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(paidUserFeaturesList.results.length, 0);

        await this.warrant.Feature.assignFeatureToUser(paidUser.userId, customFeature.featureId);

        paidUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidUser }, { warrantToken: "latest" });
        assert.strictEqual(paidUserHasFeature, true);

        paidUserFeaturesList = await this.warrant.Feature.listFeaturesForUser(paidUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(paidUserFeaturesList.results.length, 1);
        assert.strictEqual(paidUserFeaturesList.results[0].featureId, "custom-feature");
        assert.deepStrictEqual(paidUserFeaturesList.results[0].meta, { name: "Custom Feature" })

        await this.warrant.Feature.removeFeatureFromUser(paidUser.userId, customFeature.featureId);

        paidUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidUser }, { warrantToken: "latest" });
        assert.strictEqual(paidUserHasFeature, false);

        paidUserFeaturesList = await this.warrant.Feature.listFeaturesForUser(paidUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(paidUserFeaturesList.results.length, 0);

        // Assign 'feature-1' -> 'free' tier -> free user
        let freeUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeUser }, { warrantToken: "latest" });
        assert.strictEqual(freeUserHasFeature, false);

        let freeTierFeaturesList = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTierFeaturesList.results.length, 0);

        let freeUserTiersList = await this.warrant.PricingTier.listPricingTiersForUser(freeUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeUserTiersList.results.length, 0);

        await this.warrant.Feature.assignFeatureToPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.assignPricingTierToUser(freeUser.userId, freeTier.pricingTierId);

        freeUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeUser }, { warrantToken: "latest" });
        assert.strictEqual(freeUserHasFeature, true);

        freeTierFeaturesList = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTierFeaturesList.results.length, 1);
        assert.strictEqual(freeTierFeaturesList.results[0].featureId, "feature-1");
        assert.strictEqual(freeTierFeaturesList.results[0].meta, undefined);

        freeUserTiersList = await this.warrant.PricingTier.listPricingTiersForUser(freeUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeUserTiersList.results.length, 1);
        assert.strictEqual(freeUserTiersList.results[0].pricingTierId, "free");
        assert.deepStrictEqual(freeUserTiersList.results[0].meta, { name: "Free Tier" });

        await this.warrant.Feature.removeFeatureFromPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.removePricingTierFromUser(freeUser.userId, freeTier.pricingTierId);

        freeUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeUser }, { warrantToken: "latest" });
        assert.strictEqual(freeUserHasFeature, false);

        freeTierFeaturesList = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTierFeaturesList.results.length, 0);

        freeUserTiersList = await this.warrant.PricingTier.listPricingTiersForUser(freeUser.userId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeUserTiersList.results.length, 0);

        // Clean up
        await this.warrant.User.delete(freeUser.userId);
        await this.warrant.User.delete(paidUser.userId);
        await this.warrant.PricingTier.delete(freeTier.pricingTierId);
        await this.warrant.PricingTier.delete(paidTier.pricingTierId);
        await this.warrant.Feature.delete(customFeature.featureId);
        await this.warrant.Feature.delete(feature1.featureId);
        await this.warrant.Feature.delete(feature2.featureId);
    });

    it('pricing tiers, features, and tenants example', async function () {
        // Create tenants
        const freeTenant = await this.warrant.Tenant.create();
        const paidTenant = await this.warrant.Tenant.create();

        // Create pricing tiers
        const freeTier = await this.warrant.PricingTier.create({ pricingTierId: "free", meta: { name: "Free Tier" }});
        const paidTier = await this.warrant.PricingTier.create({ pricingTierId: "paid" });

        // Create features
        const customFeature = await this.warrant.Feature.create({ featureId: "custom-feature", meta: { name: "Custom Feature" }});
        const feature1 = await this.warrant.Feature.create({ featureId: "feature-1", meta: { description: "First feature" } });
        const feature2 = await this.warrant.Feature.create({ featureId: "feature-2" });

        // Assign 'custom-feature' -> paid tenant
        let paidTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidTenant }, { warrantToken: "latest" });
        assert.strictEqual(paidTenantHasFeature, false);

        let paidTenantFeaturesList = await this.warrant.Feature.listFeaturesForTenant(paidTenant.tenantId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(paidTenantFeaturesList.results.length, 0);

        await this.warrant.Feature.assignFeatureToTenant(paidTenant.tenantId, customFeature.featureId);

        paidTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidTenant }, { warrantToken: "latest" });
        assert.strictEqual(paidTenantHasFeature, true);

        paidTenantFeaturesList = await this.warrant.Feature.listFeaturesForTenant(paidTenant.tenantId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(paidTenantFeaturesList.results.length, 1);
        assert.strictEqual(paidTenantFeaturesList.results[0].featureId, "custom-feature");
        assert.deepStrictEqual(paidTenantFeaturesList.results[0].meta, { name: "Custom Feature" });

        await this.warrant.Feature.removeFeatureFromTenant(paidTenant.tenantId, customFeature.featureId);

        paidTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidTenant }, { warrantToken: "latest" });
        assert.strictEqual(paidTenantHasFeature, false);

        paidTenantFeaturesList = await this.warrant.Feature.listFeaturesForTenant(paidTenant.tenantId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(paidTenantFeaturesList.results.length, 0);

        // Assign 'feature-1' -> 'free' tier -> free tenant
        let freeTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeTenant }, { warrantToken: "latest" });
        assert.strictEqual(freeTenantHasFeature, false);

        let freeTierFeaturesList = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTierFeaturesList.results.length, 0);

        let freeTenantTiersList = await this.warrant.PricingTier.listPricingTiersForTenant(freeTenant.tenantId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTenantTiersList.results.length, 0);

        await this.warrant.Feature.assignFeatureToPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.assignPricingTierToTenant(freeTenant.tenantId, freeTier.pricingTierId);

        freeTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeTenant }, { warrantToken: "latest" });
        assert.strictEqual(freeTenantHasFeature, true);

        freeTierFeaturesList = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTierFeaturesList.results.length, 1);
        assert.strictEqual(freeTierFeaturesList.results[0].featureId, "feature-1");
        assert.deepStrictEqual(freeTierFeaturesList.results[0].meta, { description: "First feature" });

        freeTenantTiersList = await this.warrant.PricingTier.listPricingTiersForTenant(freeTenant.tenantId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTenantTiersList.results.length, 1);
        assert.strictEqual(freeTenantTiersList.results[0].pricingTierId, "free");
        assert.deepStrictEqual(freeTenantTiersList.results[0].meta, { name: "Free Tier" });

        await this.warrant.Feature.removeFeatureFromPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.removePricingTierFromTenant(freeTenant.tenantId, freeTier.pricingTierId);

        freeTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeTenant }, { warrantToken: "latest" });
        assert.strictEqual(freeTenantHasFeature, false);

        freeTierFeaturesList = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTierFeaturesList.results.length, 0);

        freeTenantTiersList = await this.warrant.PricingTier.listPricingTiersForTenant(freeTenant.tenantId, { limit: 100 }, { warrantToken: "latest" });
        assert.strictEqual(freeTenantTiersList.results.length, 0);

        // Clean up
        await this.warrant.Tenant.delete(freeTenant.tenantId);
        await this.warrant.Tenant.delete(paidTenant.tenantId);
        await this.warrant.PricingTier.delete(freeTier.pricingTierId);
        await this.warrant.PricingTier.delete(paidTier.pricingTierId);
        await this.warrant.Feature.delete(customFeature.featureId);
        await this.warrant.Feature.delete(feature1.featureId);
        await this.warrant.Feature.delete(feature2.featureId);
    });

    it('sessions', async function () {
        const user = await this.warrant.User.create();
        const tenant = await this.warrant.Tenant.create();

        await this.warrant.User.assignUserToTenant(tenant.tenantId, user.userId, "admin");

        const userAuthzSession = await this.warrant.Session.createAuthorizationSession({ userId: user.userId });
        assert(userAuthzSession);

        const userSelfServiceDashboardUrl = await this.warrant.Session.createSelfServiceSession({
            userId: user.userId,
            tenantId: tenant.tenantId,
            selfServiceStrategy: SelfServiceStrategy.FGAC,
        }, "http://localhost:8080");
        assert(userSelfServiceDashboardUrl);

        await this.warrant.User.delete(user.userId);
        await this.warrant.Tenant.delete(tenant.tenantId);
    });

    it('warrants', async function () {
        const newUser = await this.warrant.User.create();
        const newPermission = await this.warrant.Permission.create({ permissionId: "perm1", meta: { name: "Permission 1", description: "Permission with id 1" }});

        let userHasPermission = await this.warrant.Authorization.check({
            object: newPermission,
            relation: "member",
            subject: newUser
        }, {
            warrantToken: "latest"
        });
        assert.strictEqual(userHasPermission, false);

        await this.warrant.Warrant.create({
            object: newPermission,
            relation: "member",
            subject: newUser
        });

        userHasPermission = await this.warrant.Authorization.check({
            object: newPermission,
            relation: "member",
            subject: newUser
        }, {
            warrantToken: "latest"
        });
        assert.strictEqual(userHasPermission, true);

        const query = `select permission where user:${newUser.userId} is member`;
        const response = await this.warrant.Warrant.query(query);

        assert.strictEqual(response.results.length, 1);
        assert.strictEqual(response.results[0].objectType, "permission");
        assert.strictEqual(response.results[0].objectId, "perm1");
        assert.strictEqual(response.results[0].warrant.relation, "member");

        await this.warrant.Warrant.delete({
            object: newPermission,
            relation: "member",
            subject: newUser
        });

        userHasPermission = await this.warrant.Authorization.check({
            object: newPermission,
            relation: "member",
            subject: newUser
        }, {
            warrantToken: "latest"
        });
        assert.strictEqual(userHasPermission, false);

        await this.warrant.User.delete(newUser.userId);
        await this.warrant.Permission.delete(newPermission.permissionId);
    });

    it('warrant with policy', async function () {
        await this.warrant.Warrant.create({
            object: {
                objectType: "permission",
                objectId: "test-permission"
            },
            relation: "member",
            subject: {
                objectType: "user",
                objectId: "user-1"
            },
            policy: `geo == "us"`
        });

        let checkResult = await this.warrant.Authorization.check({
            object: {
                objectType: "permission",
                objectId: "test-permission"
            },
            relation: "member",
            subject: {
                objectType: "user",
                objectId: "user-1"
            },
            context: {
                "geo": "us",
            }
        }, {
            warrantToken: "latest"
        });
        assert.strictEqual(checkResult, true);

        checkResult = await this.warrant.Authorization.check({
            object: {
                objectType: "permission",
                objectId: "test-permission"
            },
            relation: "member",
            subject: {
                objectType: "user",
                objectId: "user-1"
            },
            context: {
                "geo": "eu",
            }
        }, {
            warrantToken: "latest"
        });
        assert.strictEqual(checkResult, false);

        await this.warrant.Warrant.delete({
            object: {
                objectType: "permission",
                objectId: "test-permission"
            },
            relation: "member",
            subject: {
                objectType: "user",
                objectId: "user-1"
            },
            policy: `geo == "us"`
        });

        // Clean up
        await this.warrant.Permission.delete("test-permission");
        await this.warrant.User.delete("user-1");
    });
});
