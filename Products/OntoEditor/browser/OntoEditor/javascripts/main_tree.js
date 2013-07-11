function initTrees() {
		jq("#black").treeview({
			url: "source.php"
		})
		
		jq("#mixed").treeview({
			url: "tree_view&test=''",
			// add some additional, dynamic data and request with POST
			ajax: {
				data: {
					"additional": function() {
						return "yeah: " + new Date;
					}
				},
				type: "post"
			}
		});
	}
	jq(document).ready(function(){
		initTrees();
		jq("#refresh").click(function() {
			jq("#black").empty();
			jq("#mixed").empty();
			initTrees();
		});
	});