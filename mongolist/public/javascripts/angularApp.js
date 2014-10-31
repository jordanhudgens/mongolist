angular.module('mongoList', ['ui.router', 'ngResource'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl'
                })
                .state('listings', {
                    url: '/listings/{id}',
                    templateUrl: '/listings.html',
                    controller: 'ListingsCtrl'
                });

            $urlRouterProvider.otherwise('home');
        }])
    .factory('Listing',
    function($resource, $q){
        var res = $resource('/listings/:id', {id: '@id'});
        var resQuestions = $resource('/listings/:listingId/questions/', {listingId: '@listingId'});
        var resLikes = $resource('/listings/:listingId/like', {listingId: '@listingId'});
        return {
            create: function(attrs) {
                var listing = new res(attrs);
                listing.$save();
            },
            get: function(id) {
                var deferred = $q.defer();
                res.get({id: id}, function(listing) {
                    deferred.resolve(listing);
                });
                return deferred.promise;
            },
            all: function() {
                return res.query();
            },
            addQuestion: function(listingId, attrs) {
                attrs.listingId = listingId;
                var question = new resQuestions(attrs);
                question.$save();
            },
            addLike: function(listingId) {
                var like = new resLikes({listingId: listingId});
                like.$save();
            }
        };
    })
    .controller('ListingsCtrl', [
        '$scope', '$stateParams', 'Listing',
        function($scope, $stateParams, Listing){
            Listing.get($stateParams.id).then(function(listing) {
                $scope.listing = listing;
            });
            $scope.addQuestion = function () {
                var question = {body: $scope.question, customer: $scope.name};
                Listing.addQuestion($scope.listing._id, question);
                $scope.listing.questions.push(question);
                $scope.question = $scope.name = '';
            };
            $scope.addLike = function () {
                Listing.addLike($scope.listing._id);
                $scope.listing.likes += 1;
            }
        }])
    .controller('MainCtrl', [
        '$scope',
        'Listing',
        function($scope, Listing){
            $scope.listings = Listing.all();
            $scope.addListing = function(){
                var listing = {title: $scope.title, description: $scope.description, likes: 0};
                $scope.listings.push(listing);
                $scope.title = '';
                Listing.create(listing);
            };
        }]);