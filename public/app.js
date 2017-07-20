/**
 * Created by rpaulin on 7/19/17.
 */



$("#scrape_btn").on("click",function(){

    //$("#article_section").empty();

   $.post("/scrape",{},function(data){

       location.reload();
       //console.log(data);
       //activate modal


   })


});


$(".save_article").on("click",function(){

    //$("#article_section").empty();

    console.log("something");

    var this_article = {

        title: $(this).attr("title"),
        link: $(this).attr("link")

    };

    $.post("/save_article",this_article,function(data){

        alert("article saved: " + data.title);


    })


});

$(".submit_note").on("click",function(){

    var article_id = $(this).attr("value");

    var note = {

        id: article_id,
        text: $("#note_text_" + article_id).val()


    }

    $.post("/save_note",note,function(data){

        //alert("article saved: " + data.title);

        $("#" + article_id).modal('hide');

    })

});

$(".delete_note").on("click",function(){

    var note = $(this).attr("value");

    var delete_info = {

        text: note


    }

    $.post("/delete_note",delete_info,function(data){

        //alert("article saved: " + data.title);

        $(".modal").modal('hide');
        location.reload();

    })

});