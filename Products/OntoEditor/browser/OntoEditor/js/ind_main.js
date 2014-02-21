/*
(function ($) {
 $(document).ready(function() {
 
 var overlayDiv = $(".overlay_popup").overlay(
 {expose: '#000000', 
 close: '.close_overlay',   
 finish: { top: 'center', left: 'center', absolute: false }});
 $(".overlay_popup").bind("click", function(){overlayDiv.load();})
$('#ex').prepOverlay({
subtype: 'ajax',
filter: '#content',
formselector: '#manager_form',
noform: 'close' 
});

}); 
}(jQuery));
 */
function getonto(){
    
    var url1=document.baseURI+"ind_add?listonto=all";
	//alert(url1);
	jq.ajax({
                url: url1, 
                cache: false, // prevent undesired results by turning cache off
                complete: function(data, status) {
                    var json = eval('(' + data.responseText + ')');
                    var tmp='';
                    //<select class="array" id="sel_onto">';
                    jq.each(json, function(key, value) {
					//alert(key+' '+value);
					tmp=tmp+'<option value="'+key+'">'+key+'</option>';
                    });
                    jq("#sel_onto1").html(tmp);
					jq('#sel_onto1').bind('click', getrootclass());
                    }
					
            });
	

};
function getitems(){
	var root=jq('#sel_onto1 option:selected').val();
	//alert(root);
    var url1=document.baseURI+"ind_add?ontology="+root+"&ontoitem=classes";
	//alert(url1);
	
	jq.getJSON(url1, function(data) {  
	
      jq.each(data, function(key, val) {
		tmp='';
		for (i = 0; i < val.length; i++){
				tmp=tmp+'<li>'+val[i]['name']+'</li>';
             	jq("#sel_class").html(tmp);
			};
	  });
     });

	
};    
function getrootclass(){
	var root=jq('#sel_onto1 option:selected').val();
    var url1=document.baseURI+"ind_add?ontology="+root+"&ontoitem=rootclass";
	//alert(url1);
	jq.getJSON(url1, function(data) {  
    jq.each(data, function(key, val) {
		//alert(key+' '+val);
		tmp='';
		tmp=tmp+'<li>'+data['title']+'</li>';
        jq("#sel_class").html(tmp);
			});
		//jq('#sel_onto1').bind('change', getrootclass());
	  });
};

	
 
/*

	jq("#sel_onto1").change(function() {
      var new_val=$('#sel_onto1 option:selected').val();
      //alert(new_val);
      var url2=document.baseURI+"ind_add?ontology="+new_val+"&ontoitem=classes";
      jq.getJSON(url2, function(data) {
	         tmp=''
             jq.each(data, function(key, value) {
					tmp=tmp+'<li>'+value+'</li>';
                    });
			jq("#sel_class").html(tmp);
              });
     });
	 
	 function getclasses(){
    var url1=document.baseURI+""ind_add?ontology="+new_val+"&ontoitem=classes";
	jq.ajax({
                url: url1, 
                cache: false, // prevent undesired results by turning cache off
                complete: function(data, status) {
                    var json = eval('(' + data.responseText + ')');
                    var tmp='';
                    //<select class="array" id="sel_onto">';
                    jq.each(json, function(key, value) {
					tmp=tmp+'<li value="'+value+'">'+value+'</li>';
                    });
                    //tmp=tmp+'</select>'
                    jq("#sel_onto1").html(tmp);
                    }
            });
	
    };  
*/	