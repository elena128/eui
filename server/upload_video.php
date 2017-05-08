<?php 
print_r($_FILES);

$file = $_FILES['data'];
$name = $_POST['name'];
 
if($file['error']==0){
 	if(!file_exists('./uploads/'.$name)){
  		if(!move_uploaded_file($file['tmp_name'],'./uploads/'.$name)){
   			echo 'failed';
  		}
 	}else{
  		$content=file_get_contents($file['tmp_name']);
  		if (!file_put_contents('./uploads/'.$name, $content,FILE_APPEND)) {
   			echo 'failed';
  		}
 	}
}else{
 	echo 'failed';
} 
?> 