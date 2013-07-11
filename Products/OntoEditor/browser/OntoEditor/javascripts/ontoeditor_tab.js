jq.noConflict();
jq(document).ready(function($){

jq(".node_tree").click(function(){
    var currentId = jq(this).attr('id');
    alert(currentId);
    url_load='recurse_tab?node='+currentId;
    newid='#'+currentId
    jq(newid).load(url_load);
   
    });


})

    
