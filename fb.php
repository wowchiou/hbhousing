<?php 
//連結檔案===============================================================
	include_once("lib/setting.php");
	include_once("lib/db_conn.php");
    
    $og_url =  ($_GET['img']) ? WEBURL."fb.php?img=".$_GET['img']."&user_name=".$_GET['user_name']."&time=".time() : WEBURL."fb.php?".time();
    $og_image =  ($_GET['img']) ? WEBURL."uploads/merge/".$_GET['img']."?".time() : WEBURL."images/fb_share.jpg";
    $og_title = "幸福好宅，".$_GET['user_name']."自己作「組」！立即參加抽好禮！";
?>
<!DOCTYPE html>
<html lang="zh-Hant-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title><?php print_r($og_title);?></title>

    <!-- fb 分享設定 -->
    <meta property="og:title" content="<?php print_r($og_title);?>" />
    <meta
      property="og:description"
      content="即日起至12/31，參加活動即可抽肩頸鬆按摩器、SOGO禮券！"
    />
    <meta property="og:type" content="website" />
    <meta
      property="og:url"
      content="<?php print_r($og_url);?>"
    />
    <meta
      property="og:image"
      content="<?php print_r($og_image);?>"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="628" />
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-32646212-11"
    ></script>
    <script src="js/tracking.js"></script>
    <script>
      window.location.href = location.origin + '/2019-caricature/';
    </script>
  </head>
  <body></body>
</html>
