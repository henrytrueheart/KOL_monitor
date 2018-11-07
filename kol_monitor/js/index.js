$(document).ready(function(){
  var key="AIzaSyBUBV0WBBLfwypzCUioVSdBVDH2tDEcO-w";
  var kol_data=[]
  var url_comment="https://www.googleapis.com/youtube/v3/commentThreads";
  var url_views="https://www.googleapis.com/youtube/v3/videos";
  var total_views= 0 ;
  var count=0;
  var total_price= 0;
  var video="https://www.googleapis.com/youtube/v3/videos"
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
        
  //影片基本設定
        var option_video={
          key: key,
          part: 'snippet',
          id: id.videoId
        }
        
  //執行主程式
        load_comment();
        function load_comment(){
           $.getJSON(url_comment,options_comment,function(data_comment){
              loadViews(data_comment);
             })
           } 
      //匯入view 資料
        function loadViews(data_comment){

          $.getJSON(url_views,options_views,function(data){
              // console.log(data);
            var views=data.items[0].statistics.viewCount;
            var likes=data.items[0].statistics.likeCount;
            var dislikes=data.items[0].statistics.dislikeCount;
            var cpm= kol_data[i].price/(views/1000);
            //計算總數
            cpm=cpm.toFixed(2);
            total_views=Number(total_views)+Number(views);
            total_price=Number(total_price)+Number(kol_data[i].price);
            count=count+1;
            
      // 影片，影片觀看次數資料   
    $.getJSON(video,option_video,function(data_video){
      var time=data_video.items[0].snippet.publishedAt;
          time=time.substring(0,10)+" " +time.substring(11,16)
            $(".container").append(`

            <article class="col-sm-12 col-md-6">
              <h3 id=count> ${kol_data[i].name} </h3>
              <iframe width="400" height="240" 
            src="https://www.youtube.com/embed/` + id.videoId +` "frameborder="0"   allow="autoplay; 
            encrypted-media" allowfullscreen>
              </iframe>
              <h4 id="count"> Views: ${views}   Likes:  ${likes}   Dislikes: ${dislikes} </h3>
              <h4 id="count"> Comments: ${data_comment.items.length} Price: ${kol_data[i].price} CPM: ${cpm} 
            <h4 class="date"> Publish: ${time} 
            </article> `);
            
//載入上傳時間  
              
            })
            
            
            
      // 計算總Views,價錢,與ＣＰＭ
            if(count==kol_data.length){
              $(".display_total").append("<hr>");
               $(".display_total").append("Views: ",total_views,"\t");
               $(".display_total").append("Price: ",total_price,"\t");
               $(".display_total").append("CPM: ",(total_price/(total_views/1000)).toFixed(2),"\t");
               
             }
           }); // getJson尾端 


          } 
        })// each底端


             })

  
  
  

  
  
  
  
// 文件尾端不要動它！！
})