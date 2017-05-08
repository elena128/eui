<?php

	$savepath = 'uploads/';

	$fileTypes = array('jpeg','jpg','png','bmp','gif'); 

	$len = count($_FILES['image']['name']);
	if($len>1){
		for ($i=0; $i < $len; $i++) { 
			$ext[$i] = substr($_FILES['image']['name'][$i],stripos($_FILES['image']['name'][$i],'.')+1);
			$filename[$i] = substr($_FILES['image']['name'][$i],0,stripos($_FILES['image']['name'][$i],'.'));
			$savename[$i] = $filename[$i].'_'.time().'.'.$ext[$i];
			$tempFile[$i]   = $_FILES['image']['tmp_name'][$i];
			if (move_uploaded_file($tempFile[$i], $savepath.$savename[$i])){
				$save[$i] = $savepath.$savename[$i];
	 	   	}else{
	 	       	echo json_encode(array('flag'=>0,'msg'=>'上传失败'));exit;
	 	   	}
		}
		echo json_encode(array('imgurl'=>$save,'flag'=>1,'msg'=>'上传成功'));exit;
	}else{
		$ext = substr($_FILES['image']['name'],stripos($_FILES['image']['name'],'.')+1);
		$filename = substr($_FILES['image']['name'],0,stripos($_FILES['image']['name'],'.'));
		$savename = $filename.'_'.time().'.'.$ext;
		$tempFile   = $_FILES['image']['tmp_name'];
		if (move_uploaded_file($tempFile, $savepath.$savename)){
			$save = $savepath.$savename;
			echo json_encode(array('imgurl'=>$save,'flag'=>1,'msg'=>'上传成功'));exit;
 	   	}else{
 	       	echo json_encode(array('flag'=>0,'msg'=>'上传失败'));exit;
 	   	}
	}
		
?>