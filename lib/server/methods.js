/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Meteor.methods({
    adminInsertDoc(doc, collection) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            this.unblock();
            const result = adminCollectionObject(collection).insert(doc);

            return result;
        }
    },

    adminUpdateDoc(modifier, collection, _id) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            this.unblock();
            const result = adminCollectionObject(collection).update({_id}, modifier);
            return result;
        }
    },

    adminRemoveDoc(collection, _id) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            if (collection === 'Users') {
                return Meteor.users.remove({_id});
            } else {
                // global[collection].remove {_id:_id}
                return adminCollectionObject(collection).remove({_id});
            }
        }
    },


    adminNewUser(doc) {
        console.log("yadmin new user called");
        check(arguments, [Match.Any]);
        console.log("got pat check");
        if (Roles.userIsInRole(this.userId, ['admin'])) {

            const user = {};
            user.email = doc.email;
            user.username = doc.username;
            if (!doc.chooseOwnPassword) {
                user.password = doc.password;
            }

            const _id = Accounts.createUser(user);

            if (doc.sendPassword && (AdminConfig.fromEmail != null)) {
                Email.send({
                    to: user.email,
                    from: AdminConfig.fromEmail,
                    subject: 'Your account has been created',
                    html: `You've just had an account created for ${Meteor.absoluteUrl()} with password ${doc.password}`
                });
            }

            if (!doc.sendPassword) {
                return Accounts.sendEnrollmentEmail(_id);
            }

        }
    },

    adminUpdateUser(modifier, _id) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            this.unblock();
            const result = Meteor.users.update({_id}, modifier);
            return result;
        }
    },

    adminSendResetPasswordEmail(doc) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            console.log(`Changing password for user ${doc._id}`);
            return Accounts.sendResetPasswordEmail(doc._id);
        }
    },

    adminChangePassword(doc) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            console.log(`Changing password for user ${doc._id}`);
            Accounts.setPassword(doc._id, doc.password);
            return {label: 'Email user their new password'};
        }
    },

    adminCheckAdmin() {
        check(arguments, [Match.Any]);
        const user = Meteor.users.findOne({_id: this.userId});
        if (this.userId && !Roles.userIsInRole(this.userId, ['admin']) && (user.emails.length > 0)) {
            let adminEmails;
            const email = user.emails[0].address;
            if (typeof Meteor.settings.adminEmails !== 'undefined') {
                ({adminEmails} = Meteor.settings);
                if (adminEmails.indexOf(email) > -1) {
                    console.log(`Adding admin user: ${email}`);
                    return Roles.addUsersToRoles(this.userId, ['admin'], Roles.GLOBAL_GROUP);
                }
            } else if ((typeof AdminConfig !== 'undefined') && (typeof AdminConfig.adminEmails === 'object')) {
                ({adminEmails} = AdminConfig);
                if (adminEmails.indexOf(email) > -1) {
                    console.log(`Adding admin user: ${email}`);
                    return Roles.addUsersToRoles(this.userId, ['admin'], Roles.GLOBAL_GROUP);
                }
            } else if (this.userId === Meteor.users.findOne({}, {sort: {createdAt: 1}})._id) {
                console.log(`Making first user admin: ${email}`);
                return Roles.addUsersToRoles(this.userId, ['admin']);
            }
        }
    },

    adminAddUserToRole(_id, role) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            return Roles.addUsersToRoles(_id, role, Roles.GLOBAL_GROUP);
        }
    },

    adminRemoveUserToRole(_id, role) {
        check(arguments, [Match.Any]);
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            return Roles.removeUsersFromRoles(_id, role, Roles.GLOBAL_GROUP);
        }
    },

    adminSetCollectionSort(collection, _sort) {
        check(arguments, [Match.Any]);
        return global.AdminPages[collection].set({
            sort: _sort
        });
    }
});
