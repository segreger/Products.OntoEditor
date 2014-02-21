function TreeInit(selector)
{
	$(selector)
		.bind("before.jstree", function (e, data) {
			//$("#alog").append(data.func + "<br />");
		})
		.jstree({
		
			"plugins" : [ 
				"themes","json_data","ui","crrm","dnd","types","contextmenu" 
			],

			"json_data" : { 
				"ajax" : {
					"url" : "./manager",
					"data" : function (n) { 
						// the result is fed to the AJAX request `data` option
						return {  
							"action" : "getChildren", 
							"uid" : n.attr ? n.attr("id").replace("node_","") : "",
							//"lvl" : n.attr ? n.attr("lvl"): 0,
							//"type" : type.join(',')
						}; 
					}
				}
			},
			
			"types" : {
				"max_depth" : -2,
				"max_children" : -2,
				"valid_children" : [ "OntoClass", "ObjectProperty", "DataProperty", "OntoIndividual" ],
				"types" : {
					"OntoClass" : {
						"valid_children" : "OntoClass",
						"icon" : {
							"image" : "++resource++class.gif"
						}
					},
					"ObjectProperty" : {
						"valid_children" : "ObjectProperty",
						"icon" : {
							"image" : "++resource++ObjectProperty.png"
						}
					},
					"DataProperty" : {
						"valid_children" : "DataProperty",
						"icon" : {
							"image" : "++resource++DataProperty.png"
						}
					},
					"OntoIndividual" : {
						"valid_children" : "OntoIndividual",
						"icon" : {
							"image" : "++resource++ind.gif"
						},
						"start_drag" : false,
						"move_node" : false,
						"delete_node" : false,
						"remove" : false
					}
				}
			}
		});
}
function formShow(){
   /* alert('Формат экспорта не выбран'); */
	$("form #ontologyClassesTree").show();
	TreeInit("#ontologyClassesTree");
}