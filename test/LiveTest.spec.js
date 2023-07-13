const { SelfServiceStrategy, Query, WarrantClient } = require("../dist/index");
var assert = require('assert');

// Uncomment .skip and add your API_KEY to run tests
describe.skip('Live Test', function () {
    before(function () {
        this.warrant = new WarrantClient({ apiKey: "", endpoint: "https://api.warrant.dev" });
    });

    it('CRUD users', async function () {
        const user1 = await this.warrant.User.create();
        assert(user1.userId);
        assert.equal(user1.email, null);

        let user2 = await this.warrant.User.create({ userId: "some_id", email: "test@email.com" });
        let refetchedUser = await this.warrant.User.get(user2.userId);
        assert.strictEqual(user2.userId, refetchedUser.userId);
        assert.strictEqual(user2.email, refetchedUser.email);

        user2 = await this.warrant.User.update("some_id", { email: "updated@email.com" });
        refetchedUser = await this.warrant.User.get("some_id");
        assert.strictEqual(refetchedUser.userId, "some_id");
        assert.strictEqual(refetchedUser.email, "updated@email.com");

        let users = await this.warrant.User.listUsers({ limit: 10 });
        assert.strictEqual(users.length, 2);

        await this.warrant.User.delete(user1.userId);
        await this.warrant.User.delete(user2.userId);
        users = await this.warrant.User.listUsers({ limit: 10 });
        assert.strictEqual(users.length, 0);
    });

    it('CRUD tenants', async function () {
        const tenant1 = await this.warrant.Tenant.create();
        assert(tenant1.tenantId);
        assert.equal(tenant1.name, null);

        let tenant2 = await this.warrant.Tenant.create({ tenantId: "some_tenant_id", name: "new_name" });
        let refetchedTenant = await this.warrant.Tenant.get(tenant2.tenantId);
        assert.strictEqual(tenant2.tenantId, refetchedTenant.tenantId);
        assert.strictEqual(tenant2.name, refetchedTenant.name);

        tenant2 = await this.warrant.Tenant.update("some_tenant_id", { name: "updated_name" });
        refetchedTenant = await this.warrant.Tenant.get("some_tenant_id");
        assert.strictEqual(refetchedTenant.tenantId, "some_tenant_id");
        assert.strictEqual(refetchedTenant.name, "updated_name");

        let tenants = await this.warrant.Tenant.listTenants({ limit: 10 });
        assert.strictEqual(tenants.length, 2);

        await this.warrant.Tenant.delete(tenant1.tenantId);
        await this.warrant.Tenant.delete(tenant2.tenantId);
        tenants = await this.warrant.Tenant.listTenants({ limit: 10 });
        assert.strictEqual(tenants.length, 0);
    });

    it('CRUD roles', async function () {
        const adminRole = await this.warrant.Role.create({ roleId: "admin", name: "Admin", description: "The admin role" });
        assert.strictEqual(adminRole.roleId, "admin");
        assert.strictEqual(adminRole.name, "Admin");
        assert.strictEqual(adminRole.description, "The admin role");

        let viewerRole = await this.warrant.Role.create({ roleId: "viewer", name: "Viewer", description: "The viewer role" });
        let refetchedRole = await this.warrant.Role.get(viewerRole.roleId);
        assert.strictEqual(viewerRole.roleId, refetchedRole.roleId);
        assert.strictEqual(viewerRole.name, refetchedRole.name);
        assert.strictEqual(viewerRole.description, refetchedRole.description);

        viewerRole = await this.warrant.Role.update("viewer", { name: "Viewer Updated", description: "Updated desc" });
        refetchedRole = await this.warrant.Role.get("viewer");
        assert.strictEqual(refetchedRole.roleId, "viewer");
        assert.strictEqual(refetchedRole.name, "Viewer Updated");
        assert.strictEqual(refetchedRole.description, "Updated desc");

        let roles = await this.warrant.Role.listRoles({ limit: 10 });
        assert.strictEqual(roles.length, 2);

        await this.warrant.Role.delete(adminRole.roleId);
        await this.warrant.Role.delete(viewerRole.roleId);
        roles = await this.warrant.Role.listRoles({ limit: 10 });
        assert.strictEqual(roles.length, 0);
    });

    it('CRUD permissions', async function () {
        const permission1 = await this.warrant.Permission.create({ permissionId: "perm1", name: "Permission 1", description: "Permission with id 1" });
        assert.strictEqual(permission1.permissionId, "perm1");
        assert.strictEqual(permission1.name, "Permission 1");
        assert.strictEqual(permission1.description, "Permission with id 1");

        let permission2 = await this.warrant.Permission.create({ permissionId: "perm2", name: "Permission 2", description: "Permission with id 2" });
        let refetchedPermission = await this.warrant.Permission.get(permission2.permissionId);
        assert.strictEqual(permission2.permissionId, refetchedPermission.permissionId);
        assert.strictEqual(permission2.name, refetchedPermission.name);
        assert.strictEqual(permission2.description, refetchedPermission.description);

        permission2 = await this.warrant.Permission.update("perm2", { name: "Permission 2 Updated", description: "Updated desc" });
        refetchedPermission = await this.warrant.Permission.get("perm2");
        assert.strictEqual(refetchedPermission.permissionId, "perm2");
        assert.strictEqual(refetchedPermission.name, "Permission 2 Updated");
        assert.strictEqual(refetchedPermission.description, "Updated desc");

        let permissions = await this.warrant.Permission.listPermissions({ limit: 10 });
        assert.strictEqual(permissions.length, 2);

        await this.warrant.Permission.delete(permission1.permissionId);
        await this.warrant.Permission.delete(permission2.permissionId);
        permissions = await this.warrant.Permission.listPermissions({ limit: 10 });
        assert.strictEqual(permissions.length, 0);
    });

    it('CRUD features', async function () {
        const feature1 = await this.warrant.Feature.create({ featureId: "new-feature" });
        assert.strictEqual(feature1.featureId, "new-feature");

        const feature2 = await this.warrant.Feature.create({ featureId: "feature-2" });
        const refetchedFeature = await this.warrant.Feature.get(feature2.featureId);
        assert.strictEqual(feature2.featureId, refetchedFeature.featureId);

        let features = await this.warrant.Feature.listFeatures({ limit: 10 });
        assert.strictEqual(features.length, 2);

        await this.warrant.Feature.delete(feature1.featureId);
        await this.warrant.Feature.delete(feature2.featureId);
        features = await this.warrant.Feature.listFeatures({ limit: 10 });
        assert.strictEqual(features.length, 0);
    });

    it('CRUD pricing tiers', async function () {
        const tier1 = await this.warrant.PricingTier.create({ pricingTierId: "new-tier-1" });
        assert.strictEqual(tier1.pricingTierId, "new-tier-1");

        const tier2 = await this.warrant.PricingTier.create({ pricingTierId: "tier-2" });
        const refetchedTier = await this.warrant.PricingTier.get(tier2.pricingTierId);
        assert.strictEqual(tier2.pricingTierId, refetchedTier.pricingTierId);

        let tiers = await this.warrant.PricingTier.listPricingTiers({ limit: 10 });
        assert.strictEqual(tiers.length, 2);

        await this.warrant.PricingTier.delete(tier1.pricingTierId);
        await this.warrant.PricingTier.delete(tier2.pricingTierId);
        tiers = await this.warrant.PricingTier.listPricingTiers({ limit: 10 });
        assert.strictEqual(tiers.length, 0);
    });

    it('batch create users and tenants', async function () {
        const newUsers = [
            { userId: "user-1" },
            { userId: "user-2" }
        ];
        const createdUsers = await this.warrant.User.batchCreate(newUsers);
        assert.strictEqual(createdUsers.length, 2);
        assert.strictEqual(createdUsers[0].userId, "user-1");
        assert.strictEqual(createdUsers[1].userId, "user-2");

        const newTenants = [
            { tenantId: "tenant-1" },
            { tenantId: "tenant-2" }
        ];
        const createdTenants = await this.warrant.Tenant.batchCreate(newTenants);
        assert.strictEqual(createdTenants.length, 2);
        assert.strictEqual(createdTenants[0].tenantId, "tenant-1");
        assert.strictEqual(createdTenants[1].tenantId, "tenant-2");

        await this.warrant.User.delete("user-1");
        await this.warrant.User.delete("user-2");
        await this.warrant.Tenant.delete("tenant-1");
        await this.warrant.Tenant.delete("tenant-2");
    })

    it('multi-tenancy example', async function () {
        // Create users
        const user1 = await this.warrant.User.create();
        const user2 = await this.warrant.User.create();

        // Create tenants
        const tenant1 = await this.warrant.Tenant.create({ tenantId: "tenant-1", name: "Tenant 1" });
        const tenant2 = await this.warrant.Tenant.create({ tenantId: "tenant-2", name: "Tenant 2" });

        let user1Tenants = await this.warrant.Tenant.listTenantsForUser(user1.userId, { limit: 100 });
        let tenant1Users = await this.warrant.User.listUsersForTenant("tenant-1", { limit: 100 });
        assert.strictEqual(user1Tenants.length, 0);
        assert.strictEqual(tenant1Users.length, 0);

        // Assign user1 -> tenant1
        await this.warrant.User.assignUserToTenant(tenant1.tenantId, user1.userId, "member");

        user1Tenants = await this.warrant.Tenant.listTenantsForUser(user1.userId, { limit: 100 });
        assert.strictEqual(user1Tenants.length, 1);
        assert.strictEqual(user1Tenants[0].tenantId, "tenant-1");

        tenant1Users = await this.warrant.User.listUsersForTenant("tenant-1", { limit: 100 });
        assert.strictEqual(tenant1Users.length, 1);
        assert.strictEqual(tenant1Users[0].userId, user1.userId);

        // Remove user1 -> tenant1
        await this.warrant.User.removeUserFromTenant(tenant1.tenantId, user1.userId, "member");

        user1Tenants = await this.warrant.Tenant.listTenantsForUser(user1.userId, { limit: 100 });
        assert.strictEqual(user1Tenants.length, 0);

        tenant1Users = await this.warrant.User.listUsersForTenant(tenant1.tenantId, { limit: 100 });
        assert.strictEqual(tenant1Users.length, 0);

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
        const adminRole = await this.warrant.Role.create({ roleId: "admin", name: "Admin", description: "The admin role" });
        const viewerRole = await this.warrant.Role.create({ roleId: "viewer", name: "Viewer", description: "The viewer role" });

        // Create permissions
        const createPermission = await this.warrant.Permission.create({ permissionId: "create-report", name: "Create Report", description: "Permission to create reports" });
        const viewPermission = await this.warrant.Permission.create({ permissionId: "view-report", name: "View Report", description: "Permission to view reports" });

        let adminUserRoles = await this.warrant.Role.listRolesForUser(adminUser.userId, { limit: 100 });
        let adminRolePermissions = await this.warrant.Permission.listPermissionsForRole(adminRole.roleId, { limit: 100 });
        assert.strictEqual(adminUserRoles.length, 0);
        assert.strictEqual(adminRolePermissions.length, 0);

        let adminUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "create-report", subject: adminUser });
        assert.strictEqual(adminUserHasPermission, false);

        // Assign 'create-report' -> admin role -> admin user
        await this.warrant.Permission.assignPermissionToRole(adminRole.roleId, createPermission.permissionId);
        await this.warrant.Role.assignRoleToUser(adminUser.userId, adminRole.roleId);

        adminUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "create-report", subject: adminUser });
        assert.strictEqual(adminUserHasPermission, true);

        adminUserRoles = await this.warrant.Role.listRolesForUser(adminUser.userId, { limit: 100 });
        assert.strictEqual(adminUserRoles.length, 1);
        assert.strictEqual(adminUserRoles[0].roleId, adminRole.roleId);

        adminRolePermissions = await this.warrant.Permission.listPermissionsForRole(adminRole.roleId, { limit: 100 });
        assert.strictEqual(adminRolePermissions.length, 1);
        assert.strictEqual(adminRolePermissions[0].permissionId, createPermission.permissionId)

        await this.warrant.Permission.removePermissionFromRole(adminRole.roleId, createPermission.permissionId);
        await this.warrant.Role.removeRoleFromUser(adminUser.userId, adminRole.roleId);

        adminUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "create-report", subject: adminUser });
        assert.strictEqual(adminUserHasPermission, false);

        adminUserRoles = await this.warrant.Role.listRolesForUser(adminUser.userId, { limit: 100 });
        assert.strictEqual(adminUserRoles.length, 0);

        adminRolePermissions = await this.warrant.Permission.listPermissionsForRole(adminRole.roleId, { limit: 100 });
        assert.strictEqual(adminRolePermissions.length, 0);

        // Assign 'view-report' -> viewer user
        let viewerUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "view-report", subject: viewerUser });
        assert.strictEqual(viewerUserHasPermission, false);

        let viewerUserPermissions = await this.warrant.Permission.listPermissionsForUser(viewerUser.userId, { limit: 100 });
        assert.strictEqual(viewerUserPermissions.length, 0);

        await this.warrant.Permission.assignPermissionToUser(viewerUser.userId, viewPermission.permissionId);

        viewerUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "view-report", subject: viewerUser });
        assert.strictEqual(viewerUserHasPermission, true);

        viewerUserPermissions = await this.warrant.Permission.listPermissionsForUser(viewerUser.userId, { limit: 100 });
        assert.strictEqual(viewerUserPermissions.length, 1);
        assert.strictEqual(viewerUserPermissions[0].permissionId, viewPermission.permissionId);

        await this.warrant.Permission.removePermissionFromUser(viewerUser.userId, viewPermission.permissionId);

        viewerUserHasPermission = await this.warrant.Authorization.hasPermission({ permissionId: "view-report", subject: viewerUser });
        assert.strictEqual(viewerUserHasPermission, false);

        viewerUserPermissions = await this.warrant.Permission.listPermissionsForUser(viewerUser.userId, { limit: 100 });
        assert.strictEqual(viewerUserPermissions.length, 0);

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
        const freeTier = await this.warrant.PricingTier.create({ pricingTierId: "free" });
        const paidTier = await this.warrant.PricingTier.create({ pricingTierId: "paid" });

        // Create features
        const customFeature = await this.warrant.Feature.create({ featureId: "custom-feature" });
        const feature1 = await this.warrant.Feature.create({ featureId: "feature-1" });
        const feature2 = await this.warrant.Feature.create({ featureId: "feature-2" });

        // Assign 'custom-feature' -> paid user
        let paidUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidUser });
        assert.strictEqual(paidUserHasFeature, false);

        let paidUserFeatures = await this.warrant.Feature.listFeaturesForUser(paidUser.userId, { limit: 100 });
        assert.strictEqual(paidUserFeatures.length, 0);

        await this.warrant.Feature.assignFeatureToUser(paidUser.userId, customFeature.featureId);

        paidUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidUser });
        assert.strictEqual(paidUserHasFeature, true);

        paidUserFeatures = await this.warrant.Feature.listFeaturesForUser(paidUser.userId, { limit: 100 });
        assert.strictEqual(paidUserFeatures.length, 1);
        assert.strictEqual(paidUserFeatures[0].featureId, "custom-feature");

        await this.warrant.Feature.removeFeatureFromUser(paidUser.userId, customFeature.featureId);

        paidUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidUser });
        assert.strictEqual(paidUserHasFeature, false);

        paidUserFeatures = await this.warrant.Feature.listFeaturesForUser(paidUser.userId, { limit: 100 });
        assert.strictEqual(paidUserFeatures.length, 0);

        // Assign 'feature-1' -> 'free' tier -> free user
        let freeUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeUser });
        assert.strictEqual(freeUserHasFeature, false);

        let freeTierFeatures = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 });
        assert.strictEqual(freeTierFeatures.length, 0);

        let freeUserTiers = await this.warrant.PricingTier.listPricingTiersForUser(freeUser.userId, { limit: 100 });
        assert.strictEqual(freeUserTiers.length, 0);

        await this.warrant.Feature.assignFeatureToPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.assignPricingTierToUser(freeUser.userId, freeTier.pricingTierId);

        freeUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeUser });
        assert.strictEqual(freeUserHasFeature, true);

        freeTierFeatures = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 });
        assert.strictEqual(freeTierFeatures.length, 1);
        assert.strictEqual(freeTierFeatures[0].featureId, "feature-1");

        freeUserTiers = await this.warrant.PricingTier.listPricingTiersForUser(freeUser.userId, { limit: 100 });
        assert.strictEqual(freeUserTiers.length, 1);
        assert.strictEqual(freeUserTiers[0].pricingTierId, "free");

        await this.warrant.Feature.removeFeatureFromPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.removePricingTierFromUser(freeUser.userId, freeTier.pricingTierId);

        freeUserHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeUser });
        assert.strictEqual(freeUserHasFeature, false);

        freeTierFeatures = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 });
        assert.strictEqual(freeTierFeatures.length, 0);

        freeUserTiers = await this.warrant.PricingTier.listPricingTiersForUser(freeUser.userId, { limit: 100 });
        assert.strictEqual(freeUserTiers.length, 0);

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
        const freeTier = await this.warrant.PricingTier.create({ pricingTierId: "free" });
        const paidTier = await this.warrant.PricingTier.create({ pricingTierId: "paid" });

        // Create features
        const customFeature = await this.warrant.Feature.create({ featureId: "custom-feature" });
        const feature1 = await this.warrant.Feature.create({ featureId: "feature-1" });
        const feature2 = await this.warrant.Feature.create({ featureId: "feature-2" });

        // Assign 'custom-feature' -> paid tenant
        let paidTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidTenant });
        assert.strictEqual(paidTenantHasFeature, false);

        let paidTenantFeatures = await this.warrant.Feature.listFeaturesForTenant(paidTenant.tenantId, { limit: 100 });
        assert.strictEqual(paidTenantFeatures.length, 0);

        await this.warrant.Feature.assignFeatureToTenant(paidTenant.tenantId, customFeature.featureId);

        paidTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidTenant });
        assert.strictEqual(paidTenantHasFeature, true);

        paidTenantFeatures = await this.warrant.Feature.listFeaturesForTenant(paidTenant.tenantId, { limit: 100 });
        assert.strictEqual(paidTenantFeatures.length, 1);
        assert.strictEqual(paidTenantFeatures[0].featureId, "custom-feature");

        await this.warrant.Feature.removeFeatureFromTenant(paidTenant.tenantId, customFeature.featureId);

        paidTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "custom-feature", subject: paidTenant });
        assert.strictEqual(paidTenantHasFeature, false);

        paidTenantFeatures = await this.warrant.Feature.listFeaturesForTenant(paidTenant.tenantId, { limit: 100 });
        assert.strictEqual(paidTenantFeatures.length, 0);

        // Assign 'feature-1' -> 'free' tier -> free tenant
        let freeTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeTenant });
        assert.strictEqual(freeTenantHasFeature, false);

        let freeTierFeatures = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 });
        assert.strictEqual(freeTierFeatures.length, 0);

        let freeTenantTiers = await this.warrant.PricingTier.listPricingTiersForTenant(freeTenant.tenantId, { limit: 100 });
        assert.strictEqual(freeTenantTiers.length, 0);

        await this.warrant.Feature.assignFeatureToPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.assignPricingTierToTenant(freeTenant.tenantId, freeTier.pricingTierId);

        freeTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeTenant });
        assert.strictEqual(freeTenantHasFeature, true);

        freeTierFeatures = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 });
        assert.strictEqual(freeTierFeatures.length, 1);
        assert.strictEqual(freeTierFeatures[0].featureId, "feature-1");

        freeTenantTiers = await this.warrant.PricingTier.listPricingTiersForTenant(freeTenant.tenantId, { limit: 100 });
        assert.strictEqual(freeTenantTiers.length, 1);
        assert.strictEqual(freeTenantTiers[0].pricingTierId, "free");

        await this.warrant.Feature.removeFeatureFromPricingTier(freeTier.pricingTierId, feature1.featureId);
        await this.warrant.PricingTier.removePricingTierFromTenant(freeTenant.tenantId, freeTier.pricingTierId);

        freeTenantHasFeature = await this.warrant.Authorization.hasFeature({ featureId: "feature-1", subject: freeTenant });
        assert.strictEqual(freeTenantHasFeature, false);

        freeTierFeatures = await this.warrant.Feature.listFeaturesForPricingTier(freeTier.pricingTierId, { limit: 100 });
        assert.strictEqual(freeTierFeatures.length, 0);

        freeTenantTiers = await this.warrant.PricingTier.listPricingTiersForTenant(freeTenant.tenantId, { limit: 100 });
        assert.strictEqual(freeTenantTiers.length, 0);

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

        const userSelfServicDashboardUrl = await this.warrant.Session.createSelfServiceSession({
            userId: user.userId,
            tenantId: tenant.tenantId,
            selfServiceStrategy: SelfServiceStrategy.FGAC,
        }, "http://localhost:8080");
        assert(userSelfServicDashboardUrl);

        await this.warrant.User.delete(user.userId);
        await this.warrant.Tenant.delete(tenant.tenantId);
    });

    it('warrants', async function () {
        const newUser = await this.warrant.User.create();
        const newPermission = await this.warrant.Permission.create({ permissionId: "perm1", name: "Permission 1", description: "Permission with id 1" });

        let userHasPermission = await this.warrant.Authorization.check({
            object: newPermission,
            relation: "member",
            subject: newUser
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
        });
        assert.strictEqual(userHasPermission, true);

        // const warrantQuery = Query
        //     .selectWarrants()
        //     .for({
        //         subject: newUser
        //     })
        //     .where({
        //         subject: {
        //             objectType: "user",
        //             objectId: newUser.userId
        //         }
        //     });
        // const warrants = await this.warrant.Warrant.queryWarrants(warrantQuery, { limit: 100 });

        // assert.strictEqual(warrants.length, 1);
        // assert.strictEqual(warrants[0].objectType, "permission");
        // assert.strictEqual(warrants[0].objectId, "perm1");
        // assert.strictEqual(warrants[0].relation, "member");

        await this.warrant.Warrant.delete({
            object: newPermission,
            relation: "member",
            subject: newUser
        });

        userHasPermission = await this.warrant.Authorization.check({
            object: newPermission,
            relation: "member",
            subject: newUser
        });
        assert.strictEqual(userHasPermission, false);

        await this.warrant.User.delete(newUser.userId);
        await this.warrant.Permission.delete(newPermission.permissionId);
    });

    it('warrant with policy', async function() {
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
                "geo": "us",
            }
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
    });
})
