/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Add hooks used by many forms
AutoForm.addHooks([
		'admin_insert',
		'admin_update',
		'adminNewUser',
		'adminUpdateUser',
		'adminSendResetPasswordEmail',
		'adminChangePassword'], {
	beginSubmit() {
		return $('.btn-primary').addClass('disabled');
	},
	endSubmit() {
		return $('.btn-primary').removeClass('disabled');
	},
	onError(formType, error){
		return AdminDashboard.alertFailure(error.message);
	}
}
);

AutoForm.hooks({
	admin_insert: {
		onSubmit(insertDoc, updateDoc, currentDoc){
			const hook = this;
			Meteor.call('adminInsertDoc', insertDoc, Session.get('admin_collection_name'), function(e,r){
				if (e) {
					return hook.done(e);
				} else {
					return adminCallback('onInsert', [Session.get('admin_collection_name', insertDoc, updateDoc, currentDoc)], collection => hook.done(null, collection));
				}
			});
			return false;
		},
		onSuccess(formType, collection){
			AdminDashboard.alertSuccess('Successfully created');
			return Router.go(`/admin/${collection}`);
		}
	},

	admin_update: {
		onSubmit(insertDoc, updateDoc, currentDoc){
			const hook = this;
			Meteor.call('adminUpdateDoc', updateDoc, Session.get('admin_collection_name'), Session.get('admin_id'), function(e,r){
				if (e) {
					return hook.done(e);
				} else {
					return adminCallback('onUpdate', [Session.get('admin_collection_name', insertDoc, updateDoc, currentDoc)], collection => hook.done(null, collection));
				}
			});
			return false;
		},
		onSuccess(formType, collection){
			AdminDashboard.alertSuccess('Successfully updated');
			return Router.go(`/admin/${collection}`);
		}
	},

	adminNewUser: {
		onSuccess(formType, result){
			AdminDashboard.alertSuccess('Created user');
			return Router.go('/admin/Users');
		}
	},

	adminUpdateUser: {
		onSubmit(insertDoc, updateDoc, currentDoc){
			Meteor.call('adminUpdateUser', updateDoc, Session.get('admin_id'), this.done);
			return false;
		},
		onSuccess(formType, result){
			AdminDashboard.alertSuccess('Updated user');
			return Router.go('/admin/Users');
		}
	},

	adminSendResetPasswordEmail: {
		onSuccess(formType, result){
			return AdminDashboard.alertSuccess('Email sent');
		}
	},

	adminChangePassword: {
		onSuccess(operation, result, template){
			return AdminDashboard.alertSuccess('Password reset');
		}
	}
});
