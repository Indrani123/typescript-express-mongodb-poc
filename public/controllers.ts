
let StoresApp = angular.module('StoresApp', ["ngRoute"])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

    $routeProvider.when('/addrestaurant',{
        templateUrl:'AddRestaurant/addrestaurant.html',
        controller:'addRestaurant'
    });

    $routeProvider.when('/displayAll',{
        templateUrl:'DisplayAll/displayAll.html',
        controller:'displayAll'
    });
        $routeProvider.otherwise('/login',{
            templateUrl:'login/login.html',
            controller:'login'
        });
        $routeProvider.when('/login',{
            templateUrl:'login/login.html',
            controller:'login'
        });
        
}]);

StoresApp.controller('mainController', function($scope, $http) {

});

StoresApp.controller('addRestaurant',function ($scope,$http) {
    $scope.openNav = function () {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        $('.sectionAdd').addClass('.sectionAdd-notActive');
    }

    $scope.closeNav = function () {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
    }

    $scope.resetRestaurant=function () {
        $scope.addStoreName='';
        $scope.addStoreLocation='';
        $scope.addZipCode='';
        $scope.addUserLoc='';
        $scope.addMiles='';
    }

    $scope.addRestaurantToDb=function (addStoreName,addStoreLocation,addZipCode,addUserLoc,addMiles) {

        var store={};
        var userLocation=[];
        var masterStores=[];
        var addZipCodes={};
        var addLandmark={};
        var landmark=[];
        var addStores=[];
        store["storename"]=addStoreName;
        store["miles"]=addMiles;
        store["location"]=addStoreLocation;
        addLandmark["userLoc"]=addUserLoc;
        addStores.push(store);
        addLandmark["stores"]=addStores;
        addZipCodes["zipCode"]=addZipCode;
        landmark.push(addLandmark);
        addZipCodes["userLocation"]=landmark;
        masterStores.push(addZipCodes);
        var MasterStore={} ;
        MasterStore["masterStores"]=masterStores;
        console.log(JSON.stringify(MasterStore));
        $http.post('/addUpdateStore',MasterStore,[])
            .then(function (response) {
                $scope.getResponse(response.data);
            });
    };

    $scope.getResponse=function (res) {
        $scope.addResponse=res.response.info;
        var addResp=[];
        addResp=$scope.addResponse.split(' ');
        console.log(JSON.stringify($scope.addResponse));
        if (addResp[0]=="Successfully"){
            $('#notify').toggleClass('active').fadeIn(1000);
            $('#notify').fadeOut(3000);

            setTimeout(function(){
                $(".notify").removeClass("active");
                $("#notifyType").removeClass("success");
            },3000);
        }else{
            $('#notify').toggleClass('active').fadeIn(1000);
            $('#notify').fadeOut(3000);

            setTimeout(function(){
                $(".notify").removeClass("active");
                $("#notifyType").removeClass("success");
            },3000);
        }
        $scope.clearAll();

    };

    $scope.clearAll=function(){
        $scope.addStoreName='';
        $scope.addStoreLocation='';
        $scope.addUserLoc='';
        $scope.addZipCode='';
        $scope.addMiles="";

        $scope.addResponse='';
    };

});

StoresApp.controller('login',function ($scope,$http,$location) {
    $scope.login=function(username,password){
        if (username && password) {
            var credentials;
            console.log("in login");
            credentials={"username":username, "password":password};

            $http.post('/signIn', credentials).
            then(function successCallback(response) {
             $location.path('/displayAll');
            }, function errorCallback(response) {
                // response with status 500
            });
        } else {

        }
    };
    $scope.getCredential=function (res) {
        console.log(res.username);

    };
})


StoresApp.controller('displayAll', function ($scope, $http) {
    $scope.image="./image/head1.jpeg"
    $http.get("stores.json")
        .then(function (response) {
            $scope.zipCodes=response.data;
            $scope.getAllStores();
            (<any>$("#myModal")).modal('show');
        });

    (<any>$('#ex1')).slider({
        formatter: function(value) {
            return 'Current value: ' + value;
        }
    });

    $scope.getAllStores=function(){
        $http.get("/getUserLoc/")
            .then(function (response) {
                $scope.allStores=response.data;
                console.log(JSON.stringify($scope.allStores));
            });
    };

    $scope.onSelect = function(Area){
        $scope.selectedArea=Area;
        console.log($scope.selectedArea.zipCode);
    };

    $scope.onChange =function (Area) {
        $scope.onSelect(Area);
        $scope.userSelectedLocation='';
        $scope.storesFound = [];
    };

    $scope.selectZipCode=function(selectedArea){
        $http.get("/getUserLoc/"+selectedArea.zipCode)
            .then(function (response) {
                $scope.allStores=response.data;
                console.log(JSON.stringify($scope.allStores));
            });
    };

    $scope.onSelectUserLoc=function(userLoc){
        $scope.userSelectedLocation=userLoc;
    };

    $scope.onSelectMiles=function(miles){
        $scope.selectedMiles=miles;
    };

    $scope.showRestaurant=function(selectedZipCode,userSelectedLocation,storeName,selectedMiles){
        if (storeName && selectedMiles) {
            var toFindStore;
            if (typeof selectedZipCode === 'undefined') {
                selectedZipCode = null;
            }
            toFindStore={"storename":storeName, "userLoc":userSelectedLocation, "zipCode":selectedZipCode, "miles":selectedMiles};
            console.log(JSON.stringify(toFindStore));
            $http.post('/findstores', toFindStore,[])
                .then(function (response) {
                    $scope.getStoreLocationsFromResponse(response.data[0], storeName);
                });
        } else {
            $('#storename').addClass('animated shake');
            $('#miles').addClass('animated shake');
        }
    };

    $scope.getStoreLocationsFromResponse=function (res, storeName) {
        if ( typeof res ==='undefined') {
            console.log('not found'+res);
        } else {
            $scope.storeNameFound=storeName;
            var locationFound=res.location;
            var milesFound=res.miles;
            var zipCodeFound;
            if(typeof res.zipCode==='undefined'){
                zipCodeFound=$scope.selectedArea.zipCode;
            }else {
                zipCodeFound=res.zipCode;
            }
            $scope.storesFound = [];
            for (var i in $scope.range(0,locationFound.length-1)){
                var item = {};
                item ["location"] = locationFound[i];
                item ["miles"] = milesFound[i];
                $scope.storesFound.push(item);
            }
            console.log(JSON.stringify($scope.storesFound));
        }
    };

    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };

});