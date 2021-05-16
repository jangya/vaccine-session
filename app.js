const covidAPI = 'https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true';

const baseAPI = 'https://cdn-api.co-vin.in';


const app = angular.module('app', []);

const covidCases = app.component('covidCases', {
    templateUrl: 'template/covidCases.html',
    controller: function CovidCasesController($http) {
      this.covid = {};
      this.$onInit = () => {
        $http.get(covidAPI)
        .then(
            (data) => {
                console.log(data);
                this.covid = data.data || {};
            },
            (err) => {
                console.log(err);
            }
        );
      }
    }
}) 

const vaccineCtrl = app.controller('vaccineCtrl', function ($scope, $http) {
    $scope.title = 'Vaccine session';
    $scope.states = [];
    $scope.stateId = 0;
    $scope.districts = [];
    $scope.districtId = 0;

    $scope.date = new Date();
    $scope.sessions = []
    // $scope.covid = {};

    function init() {
        // $http.get(covidAPI)
        //     .then(
        //         (data) => {
        //             console.log(data);
        //             $scope.covid = data.data || {};
        //         },
        //         (err) => {
        //             console.log(err);
        //         }
        //     );
        $http.get(baseAPI + '/api/v2/admin/location/states')
            .then(
                (data) => {
                    $scope.states = data.data?.states;
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    $scope.getDistricts = function() {
        if (!$scope.stateId) {
            $scope.districts = [];
            return;
        }

        $scope.districtId = 0;

        $http.get(baseAPI + `/api/v2/admin/location/districts/${$scope.stateId}`).then((data) => {
            $scope.districts = data.data?.districts;
        });
    }

    $scope.getCenters = function() {
        let date = $scope.date.getDate() + '-' + $scope.date.getMonth() + '-' + $scope.date.getFullYear();
        $http.get(baseAPI + `/api/v2/appointment/sessions/public/findByDistrict?district_id=${$scope.districtId}&date=${date}`)
        .then((data) => {
            $scope.sessions = data.data?.sessions;
        });
    }

    $scope.parseTime = (slots) => {
        return slots.map(str => {
            let timeArr = str.match(/\d{1,2}/g);
            return timeArr[0] + '-' + timeArr[2];
        });
    }

    init();

})