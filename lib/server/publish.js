/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Meteor.publishComposite('adminCollectionDoc', function(collection, id) {
	check(collection, String);
	check(id, Match.OneOf(String, Mongo.ObjectID));
	if (Roles.userIsInRole(this.userId, ['admin'])) {
		return {
			find() {
				return adminCollectionObject(collection).find(id);
			},
			children: __guard__(__guard__(typeof AdminConfig !== 'undefined' && AdminConfig !== null ? AdminConfig.collections : undefined, x1 => x1[collection]), x => x.children) || []
		};
	} else {
		return this.ready();
	}
});

Meteor.publish('adminUsers', function() {
	if (Roles.userIsInRole(this.userId, ['admin'])) {
		return Meteor.users.find();
	} else {
		return this.ready();
	}
});

Meteor.publish('adminUser', function() {
	return Meteor.users.find(this.userId);
});

Meteor.publish('adminCollectionsCount', function() {
	const handles = [];
	const self = this;

	_.each(AdminTables, function(table, name) {
		const id = new Mongo.ObjectID;
		let count = 0;
		table = AdminTables[name];
		let ready = false;
		const selector = table.selector ? table.selector(self.userId) : {};
		handles.push(table.collection.find().observeChanges({
			added() {
				count += 1;
				return ready && self.changed('adminCollectionsCount', id, {count});
			},
			removed() {
				count -= 1;
				return ready && self.changed('adminCollectionsCount', id, {count});
			}}));
		ready = true;

		return self.added('adminCollectionsCount', id, {collection: name, count});
});

	self.onStop(() => _.each(handles, handle => handle.stop()));
	return self.ready();
});

Meteor.publish(null, () => Meteor.roles.find({}));

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}