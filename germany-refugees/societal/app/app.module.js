(function() {
    var app = angular.module('caseStudyTabs', []);

    app.controller('TabsController', ['$scope', '$window', '$timeout', function($scope, $window, $timeout) {

        this.perspective = 'societal';

        // collapse/expand button

        if ($window.innerWidth < 670) {
            $scope.menuVisible = true;
            $scope.overlayVisible = true;
        } else {
            $scope.menuVisible = false;
            $scope.overlayVisible = false;
        }

        $scope.toggleMenu = function() {
            $scope.toggleOverlay();
            $scope.menuVisible = !$scope.menuVisible;
        }

        $scope.toggleOverlay = function() {
            $scope.overlayVisible = !$scope.overlayVisible;
        }

        // subtitle nonsense

        $scope.getMenuSubtitle = function(pane) {
            if (pane.subtitle) {
               return ': ' + pane.subtitle;
            }
        }

        this.getOverlayState = function() {
            console.log($scope.overlayVisible);
        }

        // tabs functions

        var panes = $scope.panes = [];

        $scope.panePositions = new Array();
        $scope.colorBarStyle = {'left' : '0px'};
        $scope.colorBarLeft = 0;
        $scope.activePane = 0;

        $scope.active = function() {
            var i = 1;
            var active = 0;
            angular.forEach(panes, function(pane) {
                if (pane.selected == true) {
                    active = i;
                }
                i++;
            });
            return active;
        }

        $scope.totalPanes = function() {
            return panes.length;
        }

        $scope.select = function(event, pane) {
            var element = event.target;
            if (element.nodeName == 'SPAN') {
                element = event.target.parentNode;
            }
            var footerNavButtonWidth = element.clientWidth;
            var i = 0;
            angular.forEach(panes, function(pane) {
                pane.selected = false;
                $scope.panePositions.push(i);
                i = i + footerNavButtonWidth;
            });
            pane.selected = true;
            var leftposition = $scope.panePositions[$scope.active()-1];
            $scope.colorBarLeft = leftposition + 'px';

            if ($window.innerWidth < 670) {
                $scope.toggleMenu();
            }
            window.scrollTo(0, 0);
        }

        $scope.prevPane = function() {
            if($scope.activePane !== 0){
                $scope.panes[$scope.activePane].selected = false;
                $scope.activePane--
                $scope.panes[$scope.activePane].selected = true;
            }
        }

        $scope.nextPane = function() {
            if($scope.activePane !== $scope.panes.length - 1){
                $scope.panes[$scope.activePane].selected = false;
                $scope.activePane++
                $scope.panes[$scope.activePane].selected = true;
            }
        }

        this.addPane = function(pane) {
            if (panes.length === 0) {
                pane.selected = true;
            }
            panes.push(pane);
        }

        this.numPanes = function() {
            return panes.length;
        }

    }]);

    app.directive('partTabs', [function() {
        return {
            restrict: "E",
            transclude: true,
            controller: 'TabsController',
            templateUrl: '../../app-shared/components/part-tabs.html'
        }
    }]);

    app.directive('pageTabs', [function() {
        return {
            restrict: "E",
            transclude: true,
            controller: 'TabsController',
            templateUrl: '../../app-shared/components/page-tabs.html'
        }
    }]);

    app.directive('part', ['$window', function($window) {
        return {
            require: '^partTabs',
            restrict: "E",
            scope: {
                title: "@",
                subtitle: "@",
                icon: "@",
                content: "="
            },
            link: function(scope, element, attrs, partsCtrl) {
                partsCtrl.addPane(scope);
                scope.getContentUrl = function() {
                    return 'app/views/' + attrs.content + '.html';
                }
                scope.getPartSubtitle = function(subtitle) {
                    if (typeof subtitle !== 'undefined') {
                        return ': ' + subtitle;
                    }
                }
            },
            templateUrl: '../../app-shared/components/part.html'
        }
    }]);

    app.directive('page', [function() {
        return {
            require: '^pageTabs',
            restrict: "E",
            scope: {
                title: "@",
                content: "="
            },
            link: function(scope, element, attrs, pageCtrl) {
                pageCtrl.addPane(scope);
                scope.getContentUrl = function() {
                    return 'app/views/' + attrs.content + '.html';
                }
                scope.getNumPanes = function() {
                    return pageCtrl.numPanes();
                }
            },
            templateUrl: '../../app-shared/components/page.html'
        }
    }]);

    app.directive('characterBox', [function() {
        return {
            restrict: "E",
            scope: {
                characterName: "@",
                characterLastInitial: "@",
                characterAge: "@",
                characterDescription: "@"
            },
            controller: 'TabsController',
            link: function(scope, element, attrs, tabsCtrl) {
                scope.perspective = tabsCtrl.perspective;
            },
            templateUrl: '../../app-shared/components/character-box.html'
        }
    }]);

    app.directive('interview', ['$timeout','$http', function($timeout, $http) {
        return {
            restrict: "E",
            scope: {
                character: "@",
                questions: "@"
            },
            link: function(scope, element, attrs) {
                $http.get('app/models/model.json').success(function(interviewsData) {
                    scope.questions = interviewsData[scope.character];
                });
                scope.getAudioSrc = function(filename){
                    return '../individual/assets/audio/'+filename;
                }
                $timeout(function () { // this is needed to ensure that the DOM has been completely rendered
                    $('video,audio').mediaelementplayer({
                        audioVolume: 'vertical',
                        audioWidth: '100%',
                        features: ['playpause','progress','volume']
                    });
                }, 1000, false);
            },
            templateUrl: '../../app-shared/components/interview-template.html'
        }
    }]);

})();