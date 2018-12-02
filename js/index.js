$(document).ready(function(){
  var key="AIzaSyBUBV0WBBLfwypzCUioVSdBVDH2tDEcO-w";
  var kol_data=[]
url_comment="https://www.googleapis.com/youtube/v3/commentThreads";
  var url_views="https://www.googleapis.com/youtube/v3/videos";
  var video="https://www.googleapis.com/youtube/v3/videos";
  var total_views= 0 ;
  var count=0;
  var total_price= 0;

// 切換 留言與非留言模式  
  $("#mode").on("click",function(){
  if($(this).val()=="Show Comments"){
      $(this).val("No Comments");
      $(this).css("background-color","white");
      $(this).css("color","black");
      $(".display_comment").css("display","none")
    }else{
      $(this).val("Show Comments");
      $(this).css("background-color","black");
      $(this).css("color","white");
      $(".display_comment").css("display","block")
      }
    })
  
  
  
  
//載入KOL動態資料
  var url_sheet="https://sheets.googleapis.com/v4/spreadsheets/1p-f2D0IppJYozvw4oU1RHZBDW3rFkBVkqLM2LDApF88/values/'工作表1'";
  var option_sheet={
      key: key,
      dateTimeRenderOption: 'FORMATTED_STRING',
      majorDimension: 'ROWS',
      valueRenderOption: 'FORMATTED_VALUE'
  };

  $.getJSON(url_sheet,option_sheet,function(data_kol){
      $.each(data_kol.values,function(k,value){
        if(k>0){
          kol_data.push({
            name: value[0],
            videoId: value[1],
            price: value[2],
            type: value[3]
          
          })
        }
       });
  // 迴圈開始處理基本參數
      $.each(kol_data, function(i,id){
  // 觀看紀錄基本設定
        var options_views={
          part: 'statistics',
          key: key,
          id: id.videoId
        }
  // 處理留言基本設定 
        var options_comment={
          part: 'snippet',
          key: key, 
          maxResults: 20,
          videoId: id.videoId
        };
        
   // 處理影片基本資訊設定
        var option_video={
          key: key,
          part: 'snippet',
          id: id.videoId
        }
        
  //執行主程式
        load_comment();
        function load_comment(){
           $.getJSON(url_comment,options_comment,function(data_comment){
              // console.log(data_comment);
              loadViews(data_comment);
             })
           } 
      //匯入view 資料
        function loadViews(data_comment){

          $.getJSON(url_views,options_views,function(data){
            $.getJSON(video,option_video,function(data_video){
              var title=data_video.items[0].snippet.channelTitle;
              var time=data_video.items[0].snippet.publishedAt;
                  time=time.substring(0,10)+" " +time.substring(11,16);
              var views=data.items[0].statistics.viewCount;
              var likes=data.items[0].statistics.likeCount;
              var dislikes=data.items[0].statistics.dislikeCount;
              var cpm= kol_data[i].price/(views/1000);
              var type=kol_data.type
              cpm=cpm.toFixed(2);
              total_views=Number(total_views)+Number(views);
              total_price=Number(total_price)+Number(kol_data[i].price);
              count=count+1;

      // 影片，影片觀看次數資料
            
                 $(".container").append(`
        
        <div class="display_video col-sm-12 col-md-6 col-lg-6">
        
        <iframe width="500" height="300" 
          src="https://www.youtube.com/embed/` + id.videoId +` "frameborder="0"   allow="autoplay; 
          encrypted-media" allowfullscreen>
        </iframe>
        <h3 class="col-0"id=count> ${title} </h3>
        <h4 class="date"> ${time} / ${kol_data[i].type}</h4>
        <h4 id="count"> Views: ${views}   Likes:  ${likes}   Dislikes: ${dislikes} </h4>
        <h4 id="count"> Comments: ${data_comment.items.length} Price: ${kol_data[i].price} CPM: ${cpm}</h4>
        
        
          
      </div>`);
           // each方法載入留言
        $(".container").append(`<div class="display_comment ${i} col-sm-12 col-md-6 col-lg-6"></div>`); 
        $.each(data_comment.items,function(j,item){
          var comment= item.snippet.topLevelComment.snippet.textDisplay;
          var img=item.snippet.topLevelComment.snippet.authorProfileImageUrl;
          $(`.${i}`).append(`<div class="col-sm-12 col-md-12 col-lg-12" id="comment"><img class="pic" src="${img}"> ${comment} </div>`)
        })
           
           });}); // getJson尾端 


          } 
        })// each底端


             })

  
  
  

  
  
  
  
// 文件尾端不要動它！！
})
