localStorage.setItem("lang","en");
app.controller('customerController',function($rootScope,$sce,$location,$anchorScroll,$scope,$http,$state,$timeout,$interval,toaster,$window){
	$rootScope.setting={};
	
	$rootScope.dir='rtl';
	$rootScope.left='right';
	$rootScope.right='left';
	$rootScope.langText={ar:'Ø¹Ø±Ø¨ÙŠ',en:'English'};
	$rootScope.currency=currency;
	$rootScope.calories={ar:'Ø³Ø¹Ø±Ø© Ø­Ø±Ø§Ø±ÙŠØ©',en:'Calories'};
	$rootScope.contents={ar:'Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª',en:'Contents'};
	$rootScope.extraNote={ar:'Ø¥Ø¶Ø§ÙØ© Ù…Ù„Ø§Ø­Ø¸Ø§Øª',en:'More Notes'};
	$rootScope.addToOrder={ar:'Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø·Ù„Ø¨',en:'Add To Order'};
	$rootScope.surveyTitle={ar:'Ø±Ø£ÙŠÙƒ ÙŠÙ‡Ù…Ù†Ø§',en:'Your Opinion Matters'};
	$rootScope.name={ar:'Ø§Ù„Ø§Ø³Ù…',en:'Name'};
	$rootScope.email={ar:'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø§Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',en:'Email'};
	$rootScope.mobile={ar:'Ø§Ù„Ø¬ÙˆØ§Ù„',en:'Mobile'};
	$rootScope.yes={ar:'Ù†Ø¹Ù…',en:'Yes'};
	$rootScope.no={ar:'Ù„Ø§',en:'No'};
	$rootScope.submit={ar:'Ø¥Ø±Ø³Ø§Ù„',en:'Submit'};
	$rootScope.checkoutText={ar:'ÙˆØ¶Ø¹ Ø§Ù„Ø·Ù„Ø¨',en:'Place an order'};
	$rootScope.allQuestions={ar:'ÙŠØ±Ø¬Ù‰ Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø© Ø¹Ù„Ù‰ ÙƒÙ„ Ø§Ù„Ø§Ø³ØªØ¨ÙŠØ§Ù†',en:'Please answer all Questions'};
	$rootScope.noSurvey={ar:'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø£ÙŠ Ø§Ø³ØªØ¨ÙŠØ§Ù† ÙŠØ±Ø¬Ù‰ Ø§Ù„ØªÙ‚ÙŠÙŠÙ… Ù„Ø§Ø­Ù‚Ø§Ù‹',en:'There is no survey submitted please reivew later'};
	$rootScope.vatText={ar:'Ø¶Ø±ÙŠØ¨Ø© Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„Ù…Ø¶Ø§ÙØ©:',en:'VAT Value:'};
	$rootScope.nvatText={ar:'Ø§Ù„Ø§Ø³Ø¹Ø§Ø± ØªØ´Ù…Ù„ Ø¶Ø±ÙŠØ¨Ø© Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„Ù…Ø¶Ø§ÙØ©',en:'Prices include VAT'};
	$rootScope.place={};
	$rootScope.place.selectedCategory=null;
	$rootScope.place.selectedItem=null;
	$rootScope.newCategory={name:{ar:'',en:''}};
	$rootScope.newItem={name:{ar:'',en:''},extraFields:[]};
	$rootScope.categories=[];
	$rootScope.items=[];
	$rootScope.isLoading=false;
	$rootScope.surveyLoading=false;
	$rootScope.survey={};
	$rootScope.url=$location.search();
	$rootScope.order=[];
	$rootScope.order[place_id]=[];
	$rootScope.place_id=place_id;
	if(window.localStorage.getItem('user'))
	{
		$rootScope.user=JSON.parse(window.localStorage.getItem('user'));
	}
	else
	{
		$rootScope.user={name:'',mobile:''};	
	}
	

	$scope.switchLag= function(lang)
	{
		window.localStorage.setItem('lang',lang);
		if(lang=='ar')
		{
			$rootScope.lang='ar';
			$rootScope.dir='rtl';
			$rootScope.left='right';
			$rootScope.right='left';
		}
		else
		{
			$rootScope.lang='en';
			$rootScope.dir='ltr';
			$rootScope.left='left';
			$rootScope.right='right';
		}
	}
	if(window.localStorage.getItem('lang'))
	{
		$rootScope.lang=window.localStorage.getItem('lang');
		$scope.switchLag($rootScope.lang);
	}
	else
	{
		$rootScope.lang='ar';
		$scope.switchLag('ar');
	}
	var dashbordurl = baseurl+'/dashbord/';

	if(window.localStorage.getItem('order'))
	{

		$rootScope.order=JSON.parse(window.localStorage.getItem('order'));
		if(!$rootScope.order[place_id])
		{
			$rootScope.order[place_id]=[];
			localStorage.setItem('order',JSON.stringify($rootScope.order));
		}
	}
	console.log(window.localStorage);
//================== Survey ===========================//
$scope.loadSurvey= function()
{
	return new Promise(function(resolve,reject){

		$rootScope.surveyLoading=true;
		$http.post(baseurl+'/survey',{place_id:place_id}).then(function(data){
			$rootScope.surveyLoading=false;
			$rootScope.survey = data.data;
			if($rootScope.survey.fields)
				$rootScope.survey.fields= JSON.parse($rootScope.survey.fields);
			return resolve();
		},function(error){
			return reject(error);
		})
	});

}

$scope.openSurvey=function()
{
	$scope.loadSurvey().then(function(){
		if($rootScope.survey.id){
			$('#survey').modal('show');
			if(window.localStorage.getItem('user'))
			{
				$rootScope.user=JSON.parse(window.localStorage.getItem('user'));
				$rootScope.survey.name=$rootScope.user.name;
				$rootScope.survey.mobile=$rootScope.user.mobile;
				if(!$scope.$$phase)
				{
					$scope.$apply();
				}
			}
		}

	});
	

}
$scope.closeSurvey = function()
{
	$('#survey').modal('hide');
}

$scope.saveSurvey = function()
{
	var keepGoing=true;
	$rootScope.survey.fields.forEach(function(v,k){
		if(keepGoing)
			if(!v.answer && v.type!='text')
			{
				alert($rootScope.allQuestions[$rootScope.lang]);
				keepGoing=false;
			}
		});

	if(keepGoing)
	{
		$http.post(baseurl+'/give-feedback',$rootScope.survey).then(function(data){
			$rootScope.survey={};
			$('#survey').modal('hide');

		});
	}
}
//============== Categories ================//
$scope.loadCategories = function()
{
	return new Promise(function(resolve,reject){
		$rootScope.categories=[];
		if(!$scope.$$phase) {
			$scope.$apply();	
		}

		$http.get(baseurl+'/categories?place_id='+place_id).then(function(data){
			data.data.forEach(function(v,k){

				v.name=JSON.parse(v.name);
				if(v.description);
				v.description=JSON.parse(v.description);
				if(v.items.length)
				{
					v.items.forEach(function(j,l){
						j.name=JSON.parse(j.name);
						if(v.description);
						j.description=JSON.parse(j.description);
						j.contents=JSON.parse(j.contents);
						j.extraFields=JSON.parse(j.extraFields);

					})

				}
				$rootScope.categories.push(v);	
			});
			return resolve();

		},function(error){
			return reject();
		})	
	});

}

$scope.loadCategories().then(function(){
	$('div[href="#tab'+$rootScope.categories[0].id+'"]').click();
});


$scope.addCategory = function()
{
	$rootScope.newCategory.img=$('#imgImg').attr('src');
	$rootScope.newCategory.cover=$('#coverImg').attr('src');
	$rootScope.newCategory._token=token;
	$rootScope.newCategory.user_id=user_id;
	$rootScope.newCategory.place_id=place_id;
	if(!$rootScope.newCategory.name['ar'])
	{
		alert('Please add Arabic name');
		$rootScope.setting.canAddCategory=false;
	}
	else
	{
		$rootScope.setting.canAddCategory=true;	
	}
	if(!$rootScope.newCategory.name['en'])
	{
		alert('Plase add English name')
		$rootScope.setting.canAddCategory=false;	
	}
	else
	{
		$rootScope.setting.canAddCategory=true;	
	}
	if($rootScope.setting.canAddCategory)
		$http.post(dashbordurl+'categories',$rootScope.newCategory).then(function(data){
			$rootScope.newCategory={name:{ar:'',en:''}};
			$('#new-category').modal('hide');
			$scope.loadCategories();
		});
}



//============== Items =====================//

$scope.selectItem = function(item)
{

	$rootScope.place.selectedItem=item;
	$rootScope.place.selectedItem.count=0;
	$('#itemModal').modal('show');

}
$scope.backItem = function()
{
	$('#itemModal').modal('hide');
	$rootScope.place.selectedItem=null;

}

$scope.changeItem = function(item,field)
{
	item.options=[];
	var addprice=0;
	angular.forEach(item.extraFields,function(j,l){
		if(j.type=='Radio')
		{
			if(j.answer)
			{
				item.options.push(j);
				addprice+=j.options[j.answer].price;	
			}
			
		}
		else
		{
			angular.forEach(j.answer,function(v,k){
				if(v)
				{
					item.options.push(j);
					addprice+=j.options[k].price;	

				}
			});
			
		}	
	})

	item.newprice=item.price + addprice;

}

//============ Orders ======================/
$scope.addOrder =function(item)
{
    item.name=productName.innerText;
    item.img=productImg.src;
    item.price=productPrice.innerText;
    console.log(item);
	if(!window.localStorage.getItem('ref'))
	{
		var d= new Date();
		var ref = place_id+'-'+table_id+'-'+d.getFullYear()+''+d.getMonth()+''+d.getDay()+''+d.getHours()+''+d.getMinutes()+''+d.getSeconds();
		window.localStorage.setItem('ref',ref);
	}
	else
	{
		var ref = window.localStorage.getItem('ref');
	}


	if(window.localStorage.getItem('order'))
	{
		var order =JSON.parse(window.localStorage.getItem('order'));
		item.ref= ref;
		if(!order[place_id])
			order[place_id]=[];
		order[place_id].push(item);	
		window.localStorage.setItem('order',JSON.stringify(order));
	}
	else
	{
		var order =[];
		order[place_id]=[];
		item.ref=ref;
		order[place_id].push(item);
		window.localStorage.setItem('order',JSON.stringify(order));
	}
	$rootScope.order = JSON.parse(window.localStorage.getItem('order'));
	
	$rootScope.place.selectedItem=null;
	$('#itemModal').modal('hide');
}

$scope.checkout = function()
{
	$rootScope.totalPrice=0
	$rootScope.order[place_id].forEach(function(v,k){
		if(v.newprice)
		{
			$rootScope.totalPrice+=(v.newprice*v.count);
		}
		else
		{
			$rootScope.totalPrice+=(v.price*v.count);
		}
	});
	if(table_id==0)
	{
		$rootScope.takeaway=true;
	}
	$('#cart').modal('show');
}
$scope.closeCheckout=function()
{
	$('#cart').modal('hide');	
}
$scope.deleteOrderItem=function(i,item)
{
	$rootScope.order[place_id].splice(i,1);
	window.localStorage.setItem('order',JSON.stringify($rootScope.order));
	$rootScope.totalPrice=0
	$rootScope.order[place_id].forEach(function(v,k){
		if(v.newprice)
		{
			$rootScope.totalPrice+=(v.newprice*v.count);
		}
		else
		{
			$rootScope.totalPrice+=(v.price*v.count);
		}
	});
	if($rootScope.order.length==0)
	{
		$('#cart').modal('hide');
	}
}
$scope.placeOrder = function()
{
	return new Promise(function(resolve,reject){
        $('#cart').modal('hide');
		window.location.href="order.html/";
        $rootScope.isLoading=true;
		window.localStorage.setItem('order',JSON.stringify($rootScope.order));
		// $rootScope.isLoading=false;	

        localStorage.clear();
			return resolve();



        
		// if($rootScope.takeaway && (!$rootScope.user.name || !$rootScope.user.mobile))
		// {
		// 	return;
		// }
		// if($rootScope.user.name && $rootScope.user.mobile)
		// {
		// 	window.localStorage.setItem('user',JSON.stringify($rootScope.user));
			
		// }
		// $http.post(baseurl+'/place-order',{name:$rootScope.user.name,mobile:$rootScope.user.mobile,place_id:place_id,table_id:table_id,order:$rootScope.order[place_id]}).then(function(data){
		// 	window.localStorage.removeItem('ref');
			
		// 	$rootScope.order[place_id]=[];
		// 	window.localStorage.setItem('order',JSON.stringify($rootScope.order));
		// 	$rootScope.isLoading=false;	
		// 	if(data.data)
		// 	$window.location.href=baseurl+'/order/'+data.data.ref;
		// 	return resolve();
		// },function(error){
		// 	return reject(error);
		// });
	});


}

//============ Other ================//










});