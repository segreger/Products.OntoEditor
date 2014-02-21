function TreeInit(selector, onto, ontoclass)
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
					"url" : "./treemanager",
					"data" : function (n) { 
						// the result is fed to the AJAX request `data` option
						return {  
						    "onto" : onto,
							"ontoclass" : ontoclass,
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
					"ClassObjectProperty" : {
						"valid_children" : "",
						"icon" : {
							"image" : "++resource++ClassObjectProperty.png"
						}
					},
					"ClassDataProperty" : {
						"valid_children" : "",
						"icon" : {
							"image" : "++resource++ClassDataProperty.png"
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
		})
	
		.bind("select_node.jstree", function (event, data) {
	            // `data.rslt.obj` is the jquery extended node that was clicked
	            alert(data.rslt.obj.attr("id"));
	    })
}

function formShow(selector,onto, ontoclass){
   /* alert('Формат экспорта не выбран'); */
  $(selector).show();
   TreeInit(selector,onto, ontoclass);
}
(function ($) {
 $(document).ready(function() {
 	/*$('#ex').prepOverlay({
		subtype: 'ajax',
		filter: '#panel1',
		formselector: '#class_add_form',
		noform: 'close' 
		}); */
	jq('#ex').prepOverlay({
    subtype:'ajax',
    filter: '#panel1>*',
    formselector:'form[name="class_add_form"]'
    });
    formShow("#ontologyClassesTree", "gui", "Schema");
	formShow("#ontologyClassesTree1", "gui", "Schema"); 
	


	$('#ontology_export_link').click(function(){
		var obj = $('#export_options');
		if(obj.css('display') == 'block') obj.hide();
		else obj.show();
		return false;
	});
	$('#export_ontology_button').click(function(){
		var format = $('.type_radio:checked').val();
		if(format) 
			$.ajax({
				"url" : "./manager",
				"data" : 
				{  
					"action" : "export_ontology", 
					"format" : format,
				},
				"success":function(data) {
					$('#export_result').fadeIn();
					$('#export_result').html(data);
				}
			});
		else
			alert('Формат экспорта не выбран');
			
	});
});
}(jQuery));
