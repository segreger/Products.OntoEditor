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

$("#ontologyClassesTree").show();

TreeInit("#ontologyClassesTree");
//TreeInit(["ObjectProperty", "DataProperty"], "#ontologyObjectPropertiesTree");
//TreeInit(["OntoIndividual"], "#ontologyIndividualsTree");
// TABS
/*
$('.ontologyTab').click(function(){
	var selector = $(this).attr('id').replace("tab_", "");
	$('.actionsMenu').hide();
	$('#'+selector+'Actions').show();
	$('.ontologyTree').hide();
	$('#'+selector+'Tree').show();
	$('.ontologyTab').each(function(i, obj){$(obj).removeClass('active')});
	$(this).addClass('active');
});
*/
