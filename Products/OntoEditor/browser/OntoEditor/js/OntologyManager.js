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
				"valid_children" : [ "OntoClass", "ObjectProperty", "DataProperty", "ClassObjectProperty", "ClassDataProperty", "JndObjectProperty", "IndDataProperty", "OntoIndividual" ],
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
					"ClassObjectProperty" : {
						"valid_children" : "ClassObjectProperty",
						"icon" : {
							"image" : "++resource++ClassObjectProperty.png"
						} 
					},
					"ClassDataProperty" : {
						"valid_children" : "ClassDataProperty",
						"icon" : {
							"image" : "++resource++ClassDataProperty.png"
						} 
					},
					"IndObjectProperty" : {
						"valid_children" : "IndObjectProperty",
						"icon" : {
							"image" : "++resource++IndObjectProperty.png"
						} 
					},
					"IndDataProperty" : {
						"valid_children" : "IndDataProperty",
						"icon" : {
							"image" : "++resource++IndDataProperty.png"
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
		})
		.bind("select_node.jstree", function (event, data) {
			
	           $('#class_uid').val(data.rslt.obj.attr("id"));
	           $('#class_uid').on( "change", ClsUidChange());
	           });
}		
function formShow(){

	$("form #ontologyClassesTree").show();
	TreeInit("#ontologyClassesTree");
}
function returnUID(){
	return $('#class_uid').val();
}
function ClsUidChange(){
getcommands('hasCommand');


/*
$('a#class_view').prepOverlay(
                {
                subtype: 'ajax',
                formselector: 'form[name="class_view"]',
                noform: 'reload',
                 
                }); */
}

//*******************************************
function getcommands(reflist){
	var uid=$('#class_uid').val();
    var url1=document.baseURI+"getjson?ouid="+uid+"&reflist="+reflist;
    //####################################
	$.getJSON(url1, function(data) { 
	    var panel='';
	    $('#command_panel').html('');
	    $.each(data, function(index, comm)
 		    {
 		    var uid=$('#class_uid').val();
 		    var id='"'+comm['url_command'] +'"';
 		    var ref='"'+comm['url_command'];
		    var panel=$('#command_panel').html();
		    panel=panel+'<a id='+id;
		    panel=panel+ ' href='+ref+'?onto_uid='+uid+'"';
		    panel=panel+'class='+'"command_ref"'+'>';
		    panel=panel+comm["command_name"]+'</a>|';
		    $('#command_panel').html(panel);

            });
	setOverlay();    
	});
	//######################################


//**************************************************

	}


//**************************************************************

function setOverlay()
{
if( $('.command_ref').length > 0 )
   { $('.command_ref').each(
   	function()
        {
        	installOverlayDelegates($(this));

        });

			}; 
}
 function installOverlayDelegates(elem) {

        elem.prepOverlay({
            subtype: "ajax",
            formselector: 'form[name="'+elem.attr('id')+'"]',
            noform: 'reload'
        });

    }
//,  width : "90%"
//*************************************************************

(function ($) {
 $(document).ready(function() {
    formShow();


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
