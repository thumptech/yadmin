/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
Template.AdminDashboardViewWrapper.rendered = function() {
	const node = this.firstNode;

	return this.autorun(function() {
		const data = Template.currentData();

		if (data.view) { Blaze.remove(data.view); }
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}

		return data.view = Blaze.renderWithData(Template.AdminDashboardView, data, node);
	});
};

Template.AdminDashboardViewWrapper.destroyed = function() {
	return Blaze.remove(this.data.view);
};

Template.AdminDashboardView.rendered = function() {
	const table = this.$('.dataTable').DataTable();
	const filter = this.$('.dataTables_filter');
	const length = this.$('.dataTables_length');

	filter.html(`\
<div class="input-group"> \
<input type="search" class="form-control input-sm" placeholder="Search"></input> \
<div class="input-group-btn"> \
<button class="btn btn-sm btn-default"> \
<i class="fa fa-search"></i> \
</button> \
</div> \
</div>\
`
	);

	length.html(`\
<select class="form-control input-sm"> \
<option value="10">10</option> \
<option value="25">25</option> \
<option value="50">50</option> \
<option value="100">100</option> \
</select>\
`
	);

	filter.find('input').on('keyup', function() {
		return table.search(this.value).draw();
	});

	return length.find('select').on('change', function() {
		return table.page.len(parseInt(this.value)).draw();
	});
};

Template.AdminDashboardView.helpers({
	hasDocuments() {
		return __guard__(AdminCollectionsCount.findOne({collection: Session.get('admin_collection_name')}), x => x.count) > 0;
	},
	newPath() {
		return Router.path(`adminDashboard${Session.get('admin_collection_name')}New`);
	}
});

Template.adminEditBtn.helpers({
	path() {
		return Router.path(`adminDashboard${Session.get('admin_collection_name')}Edit`, {_id: this._id});
	}
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}