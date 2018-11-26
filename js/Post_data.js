$(function(){
        // 監聽 送出訂單 按鈕點擊
        // 下面這段主要在組合資料，還有擋使用者不填資料不能送出
        $('#sendOrder').click(function(e){
          var status = true;
          // 姓名
          var name = $('#name').val();
          // url
          var link = $('#link').val(); 
          // 價格
          var price=$('#price').val();
          //類型
          var type=$('#type').val();
          
        $('input').focus(function(){
          $(this).css('border','');
        })

        // 擋住不填資料邏輯
        if(name == ''){
          $('#name').css('border','1px solid #ff0000');
          status = false;
        }
        // if(url == ''){
        //   $('#url').css('border','1px solid #ff0000');
        //   status = false;
        // }
        if(price == ''){
          $('#price').css('border','1px solid #ff0000');
          status = false;
        }
        
        if(type == ''){
          $('#type').css('border','1px solid #ff0000');
          status = false;
        }
          
          
        // 如果 �必填欄位都過了 才會到這邊
        if(status){
          // 增加日期資料
          var currentdate = new Date();
          var filltime = currentdate.getFullYear() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getDate() + "  "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
          // 打包 要的資料
          var data = {
            'name' : name, 
            'link': link,
            'time': filltime,
            'price': price,
            'type': type
          }
          // 呼叫 send ajax function
          send(data);
        }
      });
    });
    function send(data){
      $.ajax({
        // 這邊用get type
        type: "get",
        // api url - google appscript 產出的 url
        url: "https://script.google.com/macros/s/AKfycbxC-gaC_4GqJXKC35PUjtVkNWQE85m6598-5sXo2XwyLvCgd2I/exec",
        // 剛剛整理好的資料帶入
        data: data,
        // 資料格式是JSON 
        dataType: "JSON",
        // 成功送出 會回頭觸發下面這塊感謝
        success: function (response) {
          console.log(response);
          console.log(data);
          alert('已新增完成！！');
        }
      });
    }