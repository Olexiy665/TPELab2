angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope,  $ionicModal, $timeout) {


    $scope.loginData = {};


  })



  .controller('StartCtrl', function ($scope, $rootScope,$stateParams) {
    $scope.Xs = {
      'x1': {
        'Xmin': '-25',
        'Xmax': '-5'
      },
      'x2': {
        'Xmin': '-30',
        'Xmax': '45'
      }

    }
    $scope.horizontalHead = {
      "n": " ",
      "min": "min",
      "max": "max"

    }
    $scope.startYs = {
      'min': '100',
      'max': '200'
    }
    $scope.trustp = [
      {
        'm': '2',
        'Rkr': '1.69'
      },

      {
        'm': '6',
        'Rkr': '2'
      },
      {
        'm': '8',
        'Rkr': '2.17'
      },
      {
        'm': '10',
        'Rkr': '2.29'
      },
      {
        'm': '12',
        'Rkr': '2.39'
      },
      {
        'm': '15',
        'Rkr': '2.49'
      },
      {
        'm': '20',
        'Rkr': '2.62'
      },
    ];
    var Fuvs = [];
    var tetas = [];
    var index = 0;
    $scope.m = 5;
    var x1norm = [-1, -1, 1];
    var x2norm = [-1, 1, -1];
    var mx1, mx2, my;
    var planingMatrix = [[1, 2, 3], x1norm, x2norm];
    $scope.verticalHead = [
      ["X <sub> 1 </sub>"],
      ["X <sub> 2 </sub>"]];
    $scope.updateXs = {};
    var YsNorm = testing($scope.startYs, $scope.m);

    $scope.averageYs = [];
    function createAverageYs(YsNorm, m) {
      var averageYs = [];
      YsNorm = transporentArray(YsNorm);

      for (var i = 0; i < YsNorm.length; i++) {
        var sum = 0;
        for (var j = 0; j < YsNorm[0].length; j++) {
          sum += YsNorm[i][j];
        }
        averageYs[i] = Number(((sum / m).toFixed(2)));
      }


      return averageYs;
    }
    function averageArray(array) {
      var sum = 0;
      for(var i = 0; i< array.length; i++){
          sum += array[i];
      }
      return sum/array.length;
    }


    function createDespersion(averageYs, YsNorm,m) {
      var despersions = [];

      var sum = 0;
      var tmp = 0;
      YsNorm = transporentArray(YsNorm);

      for (var i = 0; i < YsNorm.length; i++) {
        sum = 0;
        for (var j = 0; j < YsNorm[0].length; j++) {
          tmp = YsNorm[i][j] - averageYs[i];
          sum += (tmp * tmp);

        }

        despersions[i] = Number(((sum / m).toFixed(2)));
      }


      return despersions;
    }

    function createDeviation(m) {
      var base = (2 * (2*m - 2)) / (m * (m - 4));


      return (Math.pow(base, 0.5)).toFixed(2);

    }
    function getIndex(trustp,  m) {
      var index = 0;
      for (var i = 0; i < trustp.length; i++) {

        if (Number(trustp[i].m) >= m) {

          index = i;
          break;
        }
      }
      return index;
    }
    function checking(trustp, Ruv, m) {

      var index = getIndex(trustp, m);

      var chekTrue = 0;
      for (var i = 0; i < Ruv.length; i++) {
        if (Ruv[i] < trustp[index].Rkr) {
          chekTrue++;
        }
      }

      return chekTrue == 3;

    }
    function creatAditYs(startYs, m) {
       var Ys = [];
      for (var i = 0; i < m; i++) {
        Ys[i] = [];
        for (var j = 0; j < 3; j++) {
           Ys[i][j]=(Math.random() * (Number(startYs.max)  - Number(startYs.min)) + Number(startYs.min)).toFixed(2);
        }
      }

      return Ys;
      }

    var flag;
    var i = 0;
    $scope.update = function (Xs) {


      $scope.updateXs = angular.copy(Xs);

      planingMatrix = planingMatrix.concat(YsNorm);


      $scope.planingMatrix = viewPlaningMatrix(planingMatrix);

      $scope.averageYs = createAverageYs(YsNorm, $scope.m);


      $scope.despersions = createDespersion($scope.averageYs, YsNorm, $scope.m);
      $scope.deviation = createDeviation($scope.m);
      $scope.Ruv = Ruv($scope.despersions, $scope.m, $scope.deviation);
      flag = checking($scope.trustp, $scope.Ruv, $scope.m);
      while(flag != true){


        var previusM = $scope.m;

        $scope.m++;

        var  index = getIndex($scope.trustp, $scope.m);

         var forNewYs = $scope.m - previusM;


        var aditYs = creatAditYs($scope.startYs, forNewYs);
        planingMatrix = planingMatrix.concat(aditYs);
        YsNorm = YsNorm.concat(aditYs);
        $scope.planingMatrix = viewPlaningMatrix(planingMatrix);
        $scope.averageYs = createAverageYs(YsNorm, $scope.m)

       $scope.despersions = createDespersion($scope.averageYs, YsNorm, $scope.m);
       $scope.deviation = createDeviation($scope.m);
       $scope.Ruv = Ruv($scope.despersions, $scope.m, $scope.deviation);

       flag = checking($scope.trustp, $scope.Ruv, $scope.m);


      }
      mx1 = averageArray(x1norm);
      mx2 = averageArray(x2norm);
      my = averageArray($scope.averageYs);
      $rootScope.mx1= mx1.toFixed(2);
      $rootScope.mx2 = mx2.toFixed(2);
      $rootScope.my = my.toFixed(2);
      var aNorm = createANorm(x1norm, x2norm);
      $rootScope.aNorm = aNorm;

       var aNorm11 = createANormXX($scope.averageYs, x1norm);
      $rootScope.aNorm11 = aNorm11.toFixed(2);
       var aNorm22 = createANormXX($scope.averageYs, x2norm);
      $rootScope.aNorm22 = aNorm22.toFixed(2);
      var znam = [[1,mx1, mx2], [mx1, $rootScope.aNorm[0], aNorm[1]], [mx1, aNorm[1], aNorm[2]]];
      $rootScope.znam = znam;
      var b0Chisl = [[my, mx1, mx2], [aNorm11,aNorm[0],aNorm[1]], [aNorm22,  aNorm[1], aNorm[2]]];
      $rootScope.b0Chisl = b0Chisl
      var b1Chisl = [[1,my, mx2], [mx1, aNorm11,aNorm[1]], [mx1, aNorm22, aNorm[2]]];
      $rootScope.b1Chisl = b1Chisl;
      var b2Chisl = [[1,mx1, my], [mx1, aNorm[0],aNorm11], [mx1, aNorm[1], aNorm22]];
      $rootScope.b2Chisl =  b2Chisl
      var b0 = Determinant(b0Chisl)/Determinant(znam);
      $rootScope.b0 = b0.toFixed(2);
      var b1 = Determinant(b1Chisl)/Determinant(znam);
      $rootScope.b1 = b1.toFixed(2);
      var b2 = Determinant(b2Chisl)/Determinant(znam);
      $rootScope.b2 = b2.toFixed(2);
      var deltaX1 = Math.abs(Xs.x1.Xmax - Xs.x1.Xmin)/2;
      $rootScope.deltaX1 = deltaX1.toFixed(2);
      var deltaX2 = Math.abs(Xs.x2.Xmax - Xs.x2.Xmin)/2;
      $rootScope.deltaX2 = deltaX2.toFixed(2);
      var x10 = (Number(Xs.x1.Xmax) + Number(Xs.x1.Xmin))/2;
      $rootScope.x10 = x10.toFixed(2);
      var x20 = (Number(Xs.x2.Xmax) + Number(Xs.x2.Xmin))/2;
      $rootScope.x20 = x20.toFixed(2);

      $rootScope.a0 = (b0 - b1* (x10/deltaX1) - b2* (x20/deltaX2)).toFixed(2);
      $rootScope.a1 = (b1/deltaX1).toFixed(2);
      $rootScope.a2 = (b2/deltaX2).toFixed(2);

      $scope.headers = createHeaders(planingMatrix);
      $rootScope.averageYs = $scope.averageYs;
      $rootScope.despersions = $scope.despersions;
      $rootScope.deviation = $scope.deviation;
      $rootScope.Ruv = $scope.Ruv;
      $rootScope.Fuvs = Fuvs;
      $rootScope.tetas = tetas;




    }
    function createHeaders(planingMatrix){
     var headers = []
     headers[0] = " ";
     headers[1] = "X1";
     headers[2] = "X2";
     for(var i = 3; i < planingMatrix.length; i++){
       headers[i] = "Y"+(i-2);
     }
     return headers;
   }
    function createANormXX(averageYs, XInorm) {
      var aNormXX=0;
      for(var i = 0; i< averageYs.length; i++){
         aNormXX += averageYs[i]*XInorm[i];
      }
      return aNormXX/averageYs.length;
    }
    function createANorm(x1norm, x2norm) {
      var aNorm = [0,0,0];
      for(var i = 0; i < x1norm.length; i++){
        aNorm[0] += x1norm[i]*x1norm[i];
        aNorm[1] += x1norm[i] * x2norm[i];
        aNorm[2] += x2norm[i]*x2norm[i];
      }
      for(var i = 0; i<aNorm.length; i++){
        aNorm[i] = Number((aNorm[i]/3).toFixed(2));
      }
      return aNorm;
    }
    function viewPlaningMatrix(planingMatrix) {
      return transporentArray(planingMatrix);
    }

    function Ruv(despersions, m, deviation) {
      Fuvs = [];
      var tempCoeff = ((m - 2)/m).toFixed(2);

      tetas = [];
      var Ruvs = [];
      Fuvs[0] = (despersions[0] / despersions[1]).toFixed(2);
      Fuvs[1] = (despersions[2] / despersions[0]).toFixed(2);
      Fuvs[2] = (despersions[2] / despersions[1]).toFixed(2);




      for (var i = 0; i < Fuvs.length; i++) {
        tetas[i] = Number(((tempCoeff * Fuvs[i])).toFixed(2));
        Ruvs[i] = Number(((Math.abs((tetas[i]-1))/deviation)).toFixed(2));
      }

      return Ruvs;

    }
    function Determinant(A){
    var N = A.length, B = [], denom = 1, exchanges = 0;
    for (var i = 0; i < N; ++i)
     { B[i] = [];
       for (var j = 0; j < N; ++j) B[i][j] = A[i][j];
     }
    for (var i = 0; i < N-1; ++i)
     { var maxN = i, maxValue = Math.abs(B[i][i]);
       for (var j = i+1; j < N; ++j)
        { var value = Math.abs(B[j][i]);
          if (value > maxValue){ maxN = j; maxValue = value; }
        }
       if (maxN > i)
        { var temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
          ++exchanges;
        }
       else { if (maxValue == 0) return maxValue; }
       var value1 = B[i][i];
       for (var j = i+1; j < N; ++j)
        { var value2 = B[j][i];
          B[j][i] = 0;
          for (var k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[i][k]*value2)/denom;
        }
       denom = value1;
     }
    if (exchanges%2) return -B[N-1][N-1];
    else return B[N-1][N-1];
}
    function transporentArray(array) {
      var transporentArray = [];
      for (var i = 0; i < array[0].length; i++) {
        transporentArray[i] = [];
        for (var j = 0; j < array.length; j++) {
          transporentArray[i][j] = array[j][i];
        }
      }
      return transporentArray;
    }

    function testing(startYs, m) {
      var YsNorm = [];
      for (var i = 0; i < m; i++) {
        YsNorm[i] = [];
        for (var j = 0; j < 3; j++) {
          YsNorm[i][j] = Math.random() * (Number(startYs.max)  - Number(startYs.min)) + Number(startYs.min);
          YsNorm[i][j] =  Number(YsNorm[i][j].toFixed(2));
        }
      }
      return YsNorm;

    }


  })
.controller('TempCtrl', function ($scope, $rootScope) {
    function createHeaders(leng, string,first){
       var headers = [];
      for(var i = 0; i < leng; i++){
        headers[i] = string+first;
        first++;
      }
      return headers;
    }

   $scope.aNorm = $rootScope.aNorm;


    $scope.aNorm11 =  $rootScope.aNorm11;

    $scope.aNorm22 = $rootScope.aNorm22;

    $scope.znam =  $rootScope.znam;

    $scope.b0Chisl = $rootScope.b0Chisl;

    $scope.b1Chisl =  $rootScope.b1Chisl;

    $scope.b2Chisl =  $rootScope.b2Chisl;

    $scope.b0 =   $rootScope.b0;

    $scope.b1 = $rootScope.b1;

    $scope.b2 =  $rootScope.b2;
    $scope.bs = [$scope.b0, $scope.b1, $scope.b2];
    $scope.deltaX1 =  $rootScope.deltaX1;

    $scope.deltaX2 =  $rootScope.deltaX2;
    $scope.deltaXs = [$scope.deltaX1, $scope.deltaX2];
    $scope.x10 =   $rootScope.x10;

    $scope.x20 =  $rootScope.x20;

   $scope.a0 =  $rootScope.a0;
    $scope.a1 = $rootScope.a1;
   $scope.a2 = $rootScope.a2;
   $scope.mx1= $rootScope.mx1;
   $scope.mx2= $rootScope.mx2;
   $scope.my =  $rootScope.my;

    $scope.averageYs = $rootScope.averageYs;
    $scope.despersions =   $rootScope.despersions;
    $scope.deviation =  $rootScope.deviation;
    $scope.Fuvs = $rootScope.Fuvs;
    $scope.tetas =  $rootScope.tetas;
    $scope.Ruv =  $rootScope.Ruv;
    $scope.averageYsHeaders = createHeaders($scope.averageYs.length, "Y", 1);
    $scope.despersionsHeaders = createHeaders($scope.despersions.length, "",1);
    $scope.FuvsHeaders = createHeaders($scope.Fuvs.length, "Fuv",1);
    $scope.tetasHeaders = createHeaders($scope.tetas.length, "",1);
    $scope.RuvsHeaders = createHeaders($scope.Ruv.length, "Ruv", 1);
    $scope.bSHeaders = createHeaders($scope.bs.length, "b", 0);
    $scope.deltaHeaders = createHeaders($scope.deltaXs.length, "", 1);
    $scope.aNormHeaders = createHeaders($scope.aNorm.length, "a", 1);





  });
