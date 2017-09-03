import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Template.registerHelper('AdminTables', AdminTables);

const adminCollections = function() {
	let collections = {};

	if ((typeof AdminConfig !== 'undefined')  && (typeof AdminConfig.collections === 'object')) {
		({ collections } = AdminConfig);
	}

	collections.Users = {
		collectionObject: Meteor.users,
		icon: 'user',
		label: 'Users'
	};

	return _.map(collections, function(obj, key) {
		obj = _.extend(obj, {name: key});
		obj = _.defaults(obj, {label: key, icon: 'plus', color: 'blue'});
		return obj = _.extend(obj, {
			viewPath: Router.path(`adminDashboard${key}View`),
			newPath: Router.path(`adminDashboard${key}New`)
		}
		);
	});
};

UI.registerHelper('AdminConfig', function() {
	if (typeof AdminConfig !== 'undefined') { return AdminConfig; }
});

UI.registerHelper('admin_skin', () => (typeof AdminConfig !== 'undefined' && AdminConfig !== null ? AdminConfig.skin : undefined) || 'blue');

UI.registerHelper('admin_collections', adminCollections);

UI.registerHelper('admin_collection_name', () => Session.get('admin_collection_name'));

UI.registerHelper('admin_current_id', () => Session.get('admin_id'));

UI.registerHelper('admin_current_doc', () => Session.get('admin_doc'));

UI.registerHelper('admin_is_users_collection', () => Session.get('admin_collection_name') === 'Users');

UI.registerHelper('admin_sidebar_items', () => AdminDashboard.sidebarItems);

UI.registerHelper('admin_collection_items', function() {
	const items = [];
	_.each(AdminDashboard.collectionItems, fn => {
		const item = fn(this.name, `/admin/${this.name}`);
		if ((item != null ? item.title : undefined) && (item != null ? item.url : undefined)) {
			return items.push(item);
		}
	});
	return items;
});

UI.registerHelper('admin_omit_fields', function() {
	let collection, global;
	if ((typeof AdminConfig.autoForm !== 'undefined') && (typeof AdminConfig.autoForm.omitFields === 'object')) {
		global = AdminConfig.autoForm.omitFields;
	}
	if (!Session.equals('admin_collection_name','Users') && (typeof AdminConfig !== 'undefined') && (typeof AdminConfig.collections[Session.get('admin_collection_name')].omitFields === 'object')) {
		collection = AdminConfig.collections[Session.get('admin_collection_name')].omitFields;
	}
	if ((typeof global === 'object') && (typeof collection === 'object')) {
		return _.union(global, collection);
	} else if (typeof global === 'object') {
		return global;
	} else if (typeof collection === 'object') {
		return collection;
	}
});

UI.registerHelper('AdminSchemas', () => AdminDashboard.schemas);

UI.registerHelper('adminGetSkin', function() {
	if ((typeof AdminConfig.dashboard !== 'undefined') && (typeof AdminConfig.dashboard.skin === 'string')) {
		return AdminConfig.dashboard.skin;
	} else {
		return 'blue';
	}
});

UI.registerHelper('adminIsUserInRole', (_id,role)=> Roles.userIsInRole(_id, role));

UI.registerHelper('adminGetUsers', () => Meteor.users);

UI.registerHelper('adminGetUserSchema', function() {
	let schema;
	if (_.has(AdminConfig, 'userSchema')) {
		schema = AdminConfig.userSchema;
	} else if (typeof Meteor.users._c2 === 'object') {
		schema = Meteor.users.simpleSchema();
	}

	return schema;
});

UI.registerHelper('adminCollectionLabel', function(collection){
	if (collection != null) { return AdminDashboard.collectionLabel(collection); }
});

UI.registerHelper('adminCollectionCount', function(collection){
	if (collection === 'Users') {
		return Meteor.users.find().count();
	} else {
		return __guard__(AdminCollectionsCount.findOne({collection}), x => x.count);
	}
});

UI.registerHelper('adminTemplate', function(collection, mode){
	if (((collection != null ? collection.toLowerCase() : undefined) !== 'users') && (typeof __guard__(__guard__(typeof AdminConfig !== 'undefined' && AdminConfig !== null ? AdminConfig.collections : undefined, x1 => x1[collection]), x => x.templates) !== 'undefined')) {
		return AdminConfig.collections[collection].templates[mode];
	}
});

UI.registerHelper('adminGetCollection', collection=> _.find(adminCollections(), item => item.name === collection));

UI.registerHelper('adminWidgets', function() {
	if ((typeof AdminConfig.dashboard !== 'undefined') && (typeof AdminConfig.dashboard.widgets !== 'undefined')) {
		return AdminConfig.dashboard.widgets;
	}
});

UI.registerHelper('adminUserEmail', function(user) {
	if (user && user.emails && user.emails[0] && user.emails[0].address) {
		return user.emails[0].address;
	} else if (user && user.services && user.services.facebook && user.services.facebook.email) {
		return user.services.facebook.email;
	} else if (user && user.services && user.services.google && user.services.google.email) {
		return user.services.google.email;
	}
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}