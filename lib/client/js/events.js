/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Template.AdminLayout.events({
	'click .btn-delete'(e,t) {
		const _id = $(e.target).attr('doc');
		if (Session.equals('admin_collection_name', 'Users')) { 
			Session.set('admin_id', _id);
			return Session.set('admin_doc', Meteor.users.findOne(_id));
		} else {
			Session.set('admin_id', parseID(_id));
			return Session.set('admin_doc', adminCollectionObject(Session.get('admin_collection_name')).findOne(parseID(_id)));
		}
	}
});

Template.AdminDeleteModal.events({
	'click #confirm-delete'() {
		const collection = Session.get('admin_collection_name');
		const _id = Session.get('admin_id');
		return Meteor.call('adminRemoveDoc', collection, _id, (e,r)=> $('#admin-delete-modal').modal('hide'));
	}
});

Template.AdminDashboardUsersEdit.events({
	'click .btn-add-role'(e,t) {
		console.log('adding user');
		return Meteor.call('adminAddUserToRole', $(e.target).attr('user'), $(e.target).attr('role'));
	},
	'click .btn-remove-role'(e,t) {
		console.log('removing user');
		return Meteor.call('adminRemoveUserToRole', $(e.target).attr('user'), $(e.target).attr('role'));
	}
});

Template.AdminHeader.events({
	'click .btn-sign-out'() {
		return Meteor.logout(() => Router.go((typeof AdminConfig !== 'undefined' && AdminConfig !== null ? AdminConfig.logoutRedirect : undefined) || '/'));
	}
});