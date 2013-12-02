var buffer = document.createElement('canvas');
var canvas = document.getElementById("myCanvas");
var ctx = buffer.getContext("2d");

var firstScenario = true;
var cars = new Array();
var car = new Image();
car.src = "car.png";

var pedestrians = new Array();
var pedestrian = new Image();
pedestrian.src = "pedestrian.png";

var isComputed = false;
var isRun = false;

// ending elapsed time in seconds
var startTime;

var carHasExited = false;
var finalTime = 0;
var displayLostTime = false;

var maxAccel = 0;


function clear_canvas()
{
    console.log("clear canvas!");

    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");

    //var c=document.getElementById("canvasBackground");
    //var bg_ctx=c.getContext("2d");
   
    console.log(ctx.canvas.width);
    console.log(ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    firstScenario = true;
}


function update(final, delay)
{
    //console.log("in update");
    var canvas=document.getElementById("myCanvas");
    var ctx=canvas.getContext("2d");

    //var final_ctx=canvas.getContext("2d");

    // Update
//    console.log("before update");
    adjustCar();
    pedTimer = setTimeout(function(){adjustPed(final);},delay);
    //var calculate_interval = setInterval("calculation()", 100);
//    console.log("after update");

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //console.log("before draw");
    drawCar();
    drawPed();
    //console.log("after draw");
    ctx.fillStyle = "#000000";
    // draw the time
    drawElapsedTime();
    if (displayLostTime == true)
    {
    	drawLostTime();
	}
}

function run_scenario()
{
	if (isComputed == false)
	{
    	alert("You must compute a scenario before you try to run the simulator.");
	}
	else if (isRun == true)
	{
		alert("You must reset the simulator before you try to run it again.")
	}
	else
	{
		isRun = true;

    	startTime = new Date();
    	//console.log("yf = "+yf);
    	//console.log("d = "+d);
    	var main_interval = setInterval("update(yf,d)", 30);
    	cars.push(new vehicle(100));
    	//console.log("yi = "+yi);
    	pedestrians.push(new walker(yi));
    	var calculate_interval = setInterval("calculation()", 100);
    }
    
}

function drawElapsedTime()
{
    var canvas=document.getElementById("myCanvas");
    var g = canvas.getContext("2d");
    if (carHasExited == false)
    {
        var elapsed = parseInt((new Date() - startTime) / 100);
        finalTime = elapsed;
    }
    g.save();
    g.beginPath();
    g.fillStyle = "#FFFFFF";
    g.font = "14px Verdana"
    // draw the running time at half opacity
    g.globalAlpha = 0.50;
    g.fillText(finalTime + " ms", canvas.width - 75, 25);
    //g.fillText(elapsed + " ms", canvas.width - 75, 25);
    g.restore();
    }

function drawLostTime()
{
	//console.log("----- LostTime");
    var canvas=document.getElementById("myCanvas");
    var g = canvas.getContext("2d");

    g.save();
    g.beginPath();
    g.fillStyle = "#FFFFFF";
    g.font = "14px Verdana"
    // draw the running time at half opacity
    if (finalTime >= 77)
    {
    	g.fillText(finalTime-77 + " ms lost", 15, 15);
    }
    else
    {
    	g.fillText("Throw away scenario", 15, 15);
    }
    //g.fillText(elapsed + " ms", canvas.width - 75, 25);
    g.restore();
    }

function set_up(initial)
{
    clear_canvas();

//    console.log("SET-UP SCENARIO");
    var c=document.getElementById("canvasBackground");
    var bg_ctx=c.getContext("2d");
    var background = new Image();

    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");

    background.onload = function() {
        bg_ctx.drawImage(background, 0, 0);

        // 1 meter = 7 pixels
    /*
        // x axis
        bg_ctx.beginPath();
        bg_ctx.moveTo(0,99.5);
        bg_ctx.lineTo(900,99.5);
        bg_ctx.stroke();

        // y axis
        bg_ctx.beginPath();
        bg_ctx.moveTo(444.5,0);
        bg_ctx.lineTo(444.5,250);
        bg_ctx.stroke();

        // starting line
        bg_ctx.beginPath();
        bg_ctx.moveTo(199.5,0);
        bg_ctx.lineTo(199.5,250);
        bg_ctx.stroke();
       
        // car top
        bg_ctx.beginPath();
        bg_ctx.moveTo(0,92.5);
        bg_ctx.lineTo(900,92.5);
        bg_ctx.stroke();
       
        // car bottom
        bg_ctx.beginPath();
        bg_ctx.moveTo(0,106.5);
        bg_ctx.lineTo(900,106.5);
        bg_ctx.stroke();
*/
        // car
        ctx.beginPath();
        ctx.fillStyle="#FF0000";
        ctx.fillRect(145,92,55,14);

        // pedestrian!
        //console.log("draw ped");
        ctx.fillStyle="#000FF0";
        ctx.beginPath();
        ctx.arc(445,100+initial*7,3.5,0,2*Math.PI);
        ctx.fill();
   
        // bool
        firstScenario = false;

      };
      //background.src = 'road_bg.png'; ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      background.src = 'road_bg.png';
   
}


function adjustCar()
{
    //console.log("adjustCar()");

    var canvas=document.getElementById("myCanvas");

    for ( var i = 0; i < cars.length; i++) {
        var this_vehicle = cars.shift();
        //if (this_vehicle.x > canvas.width + 100)
        //    continue;
        this_vehicle.x += this_vehicle.dx;
        if (this_vehicle.x > canvas.width)
        {
            //console.log("clearing interval");
            carHasExited = true;
            displayLostTime = true;
            //drawLostTime();
        }
        cars.push(this_vehicle);
    }
}


function drawCar()
{
    //console.log("drawCar()");
    var canvas=document.getElementById("myCanvas");
    var ctx=canvas.getContext("2d");

    for ( var i = 0; i < cars.length; i++) {
        var this_vehicle = cars.shift();
        ctx.drawImage(car, this_vehicle.x, this_vehicle.y);
        cars.push(this_vehicle);
    }
}


function calculation()
{
    //console.log("in calculation");
    var fs_bit=document.getElementById("failsafe");
	console.log("failsafe = "+fs_bit.checked);
    //if ((cars[0].x) < 245)
    //{
        var car_x = cars[0].x;
        //console.log("car x = "+car_x+55);
        var distance = (380) - (car_x) + 55;
        //console.log("--------------------------- = "+distance);
        //console.log("car dx = "+cars[0].dx);

        var final_vel = 0;
        var initial_vel = cars[0].dx;
        var double_d = 2 * distance;
        var final_squared =  final_vel * final_vel;
        var initial_squared = initial_vel * initial_vel;

        var change_acceleration = (final_squared - initial_squared)/(double_d);
        //console.log("change_acceleration = "+change_acceleration);
        //console.log(pedestrians[0].y);

		console.log("car.x = "+cars[0].x);
		if (fs_bit.checked == false) // Regular mode
		{
			if (93 < pedestrians[0].y && pedestrians[0].y < 107 && cars[0].x < 400)
			{
				cars[0].dx = cars[0].dx+change_acceleration*finalTime;
			//    console.log("########### "+cars[0].dx);
			//    console.log(cars[0].dx+change_acceleration*finalTime);
				//console.log(car_x);
				if (cars[0].dx <= 0.25)
				{
					cars[0].dx = 0;
					//console.log(cars[0].dx);
					//console.log("STOP THE CLOCK!!!!");
					carHasExited = true;
					if (displayLostTime == false)
					{
						//drawLostTime();
						displayLostTime = true;
					}
				}
			}
			else if (86 < pedestrians[0].y && pedestrians[0].y < 114)
			{
				if (cars[0].x < 390)
				{
				//	console.log("decel");
					cars[0].dx = (cars[0].dx+(change_acceleration/2)*finalTime);
				//    console.log("########### "+cars[0].dx);
				}
				else
				{
				//	console.log("accel");
					if( cars[0].dx < 13.8889/4.75)
					{
						cars[0].dx += 0.1;
					}
				}
			}
			else if (pedestrians[0].y <= 85 || cars[0].x >= 400 && cars[0].x >= 400) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			{
				console.log("hi");
			//    console.log("accel");
				//if( cars[0].dx < maxAccel)
				if( cars[0].dx < 13.8889/4.75)
				{
					cars[0].dx += 0.1;
				}
			}
		}
		else // Fail Safe Mode
				{
					if (93 < pedestrians[0].y && pedestrians[0].y < 130 && cars[0].x < 390)
					{	
						if (cars[0].x < 390)
						{
							console.log("HELLO");
							console.log(cars[0].x);
							console.log("ped = "+pedestrians[0].y);
							console.log("dx = "+cars[0].dx);
							cars[0].dx = cars[0].dx+(change_acceleration/2.5)*finalTime;
						//    console.log("########### "+cars[0].dx);
						//    console.log(cars[0].dx+change_acceleration*finalTime);
						//console.log(car_x);
							if (cars[0].dx <= 0.3 && pedestrians[0].y < 100)
							{
								cars[0].dx = 0;
							//console.log(cars[0].dx);
							//console.log("STOP THE CLOCK!!!!");
								carHasExited = true;
								if (displayLostTime == false)
								{
									//drawLostTime();
									displayLostTime = true;
								}
							}
						}
					}
					else if (86 < pedestrians[0].y && pedestrians[0].y < 140)
					{
						console.log("BEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEP");
						if (cars[0].x < 390)
						{
						//	console.log("decel");
							cars[0].dx = (cars[0].dx+(change_acceleration/3)*finalTime);
						//    console.log("########### "+cars[0].dx);
						}
						else
						{
						//	console.log("accel");
							if( cars[0].dx < 13.8889/4.75)
							{
								cars[0].dx += 0.1;
							}
						}
					}
					else if (pedestrians[0].y <= 85 || cars[0].x >= 400 && cars[0].x >= 400) ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
					{
						console.log("hi");
					//    console.log("accel");
						//if( cars[0].dx < maxAccel)
						if( cars[0].dx < 13.8889/4.75)
						{
							cars[0].dx += 0.1;
						}
					}
				}
        //console.log("car y = "+cars[0].y);
    //}
    //else
    //{
    //    console.log("");
    //    if(cars[0].dx < maxAccel)
    //    {
    //        cars[0].dx += 1.1;
    //    }

    //}
}   

function vehicle(pos)
{
    //console.log("VEHICLE");
    this.x = 145;
    this.y = 92;
    // 50 kph = 13.8889 m/s
    // 10 kphn = 2.77778 m/s
    this.dx = 13.8889/4.75;
    maxAccel = this.dx;
    //console.log("x = "+this.x);
    //console.log("y = "+this.y);
    //console.log("dx = "+this.dx);
}


function adjustPed(yf)
{
    //console.log("adjustPed()");

    var canvas=document.getElementById("myCanvas");

    for ( var i = 0; i < pedestrians.length; i++) {
        var this_ped = pedestrians.shift();
//        if (this_ped.x > canvas.width + 100) {
            //console.log("this_ped.x = "+this_ped.x);
            //console.log("this_ped.y = "+this_ped.y);
//            continue;
//        }
        //console.log(100-yf*7);
        if (this_ped.y > 100-(yf*7)-3)
        {
            this_ped.y -= this_ped.dy;
            pedestrians.push(this_ped);
        }
        else
        {
            pedestrians.push(this_ped);
        }

    }
}
function drawPed()
{
    //console.log("drawPed()");
    var canvas=document.getElementById("myCanvas");
    var ctx=canvas.getContext("2d");

    for ( var i = 0; i < pedestrians.length; i++) {
        var this_ped = pedestrians.shift();
        ctx.drawImage(pedestrian, this_ped.x, this_ped.y);
        pedestrians.push(this_ped);
    }
}

function walker(pos)
{
    //console.log("WALKER");
    this.x = 442;
    //this.y = 92;
    this.y = 100-(pos*7)-3;
    // 50 kph = 13.8889 m/s
    // 10 kphn = 2.77778 m/s
    this.dy = 2.77778/4.75;
    //console.log("x = "+this.x);
    //console.log("y = "+this.y);
    //console.log("dy = "+this.dy);
}
   
function compute_scenario(scenario)
{

    //clear_canvas();

    //if (firstScenario == true)
    //{
    //    set_up();
    //}

	// fail safe bit
    var fs_bit=document.getElementById("failsafe");
	console.log("failsafe = "+fs_bit.checked);
	
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
   
    console.log("computing scenario "+scenario);
    if (scenario == "1" || scenario == "2" || scenario == "3" || scenario == "4")
    {
        console.log("moving then stopped");
        console.log("-------------------");
        yi = -7; // initial position of the pedestrian (m)
        //yf = -7; // final position of the pedestrian (m)
        si = 10; // initial speed of the pedestrian (kph)
        sf = 0; // final of the pedestrian (kph)

        if (scenario == "1")
                yf = 0;
        if (scenario == "2")
                yf = -2;
        if (scenario == "3")
                yf = -3;
        if (scenario == "4")
                yf = -5;

        console.log("yi = "+yi);
        console.log("yf = "+yf);
        console.log("si = "+si);
        console.log("sf = "+sf);
        d = 0; //pedestrian is moving right away, therefore delay is 0
    }
    else if (scenario == "5" || scenario == "6" || scenario == "7")
    {
        console.log("static then moving");
        console.log("-------------------");
        si = 0; // initial speed of the pedestrian (kph)
        sf = 10; // final of the pedestrian (kph)

        if (scenario == "5")
        {
            yi = 0; // initial position of the pedestrian (m)
            d = 1.5; // delay before moving (s)
        }
        if (scenario == "6")
        {
            yi = -2; // initial position of the pedestrian (m)
            d = 1.8; // delay before moving (s)
        }
        if (scenario == "7")
        {
            yi = -4; // initial position of the pedestrian (m)
            d = 1.1; // delay before moving (s)
        }
        console.log("yi = "+yi);
        console.log("d = "+d);
        console.log("si = "+si);
        console.log("sf = "+sf);
        d = d* 1000; // converting from seconds to milliseconds
        yf = 999; // no final position for pedestrian
    }
    else if (scenario == "8" || scenario == "9" || scenario == "10")
    {
        console.log("static");
        console.log("-------------------");
        si = 0; // initial speed of the pedestrian (kph)
        sf = 0; // final of the pedestrian (kph)

        if (scenario == "8")
        {
            yi = 0; // initial position of the pedestrian (m)
            yf = 0; // no final position for pedestrian
        }
        if (scenario == "9")
        {
            yi = -2; // initial position of the pedestrian (m)
            yf = -2; // no final position for pedestrian
        }
        if (scenario == "10")
        {
            yi = -4; // initial position of the pedestrian (m)
            yf = -4; // no final position for pedestrian
        }
        console.log("yi = "+yi);
        console.log("si = "+si);
        console.log("sf = "+sf);
        d=0; // pedestrian doesn't move, therefore delay is 0
    }

    isComputed = true;

    //if (firstScenario == true)
    //{
        set_up(-yi);
    //}
}