jq.noConflict();
jq(document).ready(function($){

    var url1=document.baseURI+"guieditor?listonto=all";
    $.ajax({
                url: url1, 
                cache: false, // prevent undesired results by turning cache off
                complete: function(data, status) {
                    var json = eval('(' + data.responseText + ')');
                    var selContainer = $("#list_Onto");
                    var tmp=''
                    //$("#list_Onto").addClass('select');
                    tmp='';
                    //<select class="array" id="sel_onto">';
                    $.each(json, function(key, value) {
                    tmp=tmp+'<option value="'+value+'">'+value+'</option>';
                    });
                    //tmp=tmp+'</select>'
                    $("#sel_onto1").html(tmp);
                    $("#sel_onto2").html(tmp);
                                }
            });
        
     
     jq("#sel_onto1").change(function() {
      var new_val=$('#sel_onto1 option:selected').val();
      var url2=document.baseURI+"guieditor1?ontovalue="+new_val;
      jq.getJSON(url2, function(data) {  
      ontoEditor=''
      jq('.classesTreeBox').html='';
      ontoEditor = new OntologyEditor(data,'ontoEditor'); 
      jq('#ontoEditor_classesTreeBox').bind('click',TreeNodeClick);
      jq('.editorPanel > dl.tabbedBox > dt').bind("click",NodePanelClick);
      jq(".newElementLink .tClass").bind("click",ontoEditor.newClass());
      jq(".newElementLink .tOProp").bind("click",ontoEditor.newObjectProperty());
      jq(".newElementLink .tDProp").bind("click",ontoEditor.newDataProperty());
      jq(".newElementLink .tInd").bind("click",ontoEditor.newIndividual());
      jq(".oClass a").bind('click', ontoEditor.selectClass(this));
     });
     
     });
     
     jq("#sel_onto2").change(function() {
      var new_val=$('#sel_onto2 option:selected').val();
      //alert(new_val);
      var url2=document.baseURI+"guieditor1?ontovalue="+new_val;
      jq.getJSON(url2, function(data) {
      ontoEditor2 = new OntologyEditor(data,'editorRightPanel');
      jq('#ontoEditor_classesTreeBox').bind('click',TreeNodeClick);
      jq('#editorRightPanel_classesTreeBox').bind('click', TreeNodeClick);
       jq('.editorPanel > dl.tabbedBox > dt').bind("click",NodePanelClick);

              });

jq(".node_tree").click(function(){
    var currentId = jq(this).attr('id');
    alert(currentId);
    url_load='recurse_tab?node='+currentId;
    newid='#'+currentId
    jq(newid).load(url_load);
   
    });


})

    
