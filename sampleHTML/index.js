	var initialized = false;
	let Alert = document.getElementById("alert");
	let AlertText = document.getElementById("alertText");
	let documentType = "passport";
	let personData = null;
	var canvasMode = "pc";
	var encodedImg = "";
	var Documentcamvas;
	const Ratio = 0.85;


	function readTextFile(file)
	{
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					var allText = rawFile.responseText;
					alert(allText);
				}
			}
		}
		rawFile.send(null);
	}

	CanvasRenderingContext2D.prototype.roundedRectangle = function (x, y, w, h, r) {
		if (w < 2 * r) r = w / 2;
		if (h < 2 * r) r = h / 2;
		this.beginPath();

		this.moveTo(x+r, y);
		this.arcTo(x+w, y,   x+w, y+h, r);
		this.arcTo(x+w, y+h, x,   y+h, r);
		this.arcTo(x,   y+h, x,   y,   r);
		this.arcTo(x,   y,   x+w, y,   r);
		this.closePath();

		return this;
	  }

		function draw(text){
			var drawing = document.getElementById("canvas");
			var con = drawing.getContext("2d");
			//clear background
			con.fillStyle = "#eef6fe9e";
			const rect = con.roundedRectangle(20,20, con.measureText(text).width + 40, 60, 20);
			rect.stroke();
			rect.fill();
			con.fillStyle = "black";
			con.font = "20pt 'Roboto'";
			con.fillText(text, 40, 60);
		}

		function button_callback() {
			/*
				(0) check whether we're already running face detection
			*/
			if(initialized)
				return; // if yes, then do not initialize everything again
			/*
				(1) initialize the pico.js face detector
			*/
			var update_memory = pico.instantiate_detection_memory(4); // we will use the detecions of the last 5 frames
			var facefinder_classify_region = function(r, c, s, pixels, ldim) {return -1.0;};
			var cascadeurl = './src/files/facefinder';
			fetch(cascadeurl).then(function(response) {
				response.arrayBuffer().then(function(buffer) {
					var bytes = new Int8Array(buffer);
					facefinder_classify_region = pico.unpack_cascade(bytes);
					console.log('* facefinder loaded');
					
				})
            })
		
			/*
				(3) get the drawing context on the canvas and define a function to transform an RGBA image to grayscale
            */
			var canvas = document.getElementsByTagName('canvas')[0];
			var stegCanvas = document.getElementById('stegCanvas');
			var canvasWidth = window.innerWidth < 900 ? window.innerWidth - 30 : 800 ;
			var canvasHeight = window.innerWidth < 900 ? (window.innerWidth - 20)/ Ratio : 600 ;
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			stegCanvas.height = canvasHeight;
			stegCanvas.width = canvasWidth;
			canvas.style.display = "block"
			var ctx = canvas.getContext('2d');
			function rgba_to_grayscale(rgba, nrows, ncols) {
				var gray = new Uint8Array(nrows*ncols);
				for(var r=0; r<nrows; ++r )
					for(var c=0; c<ncols; ++c)
						// gray = 0.2*red + 0.7*green + 0.1*blue
						gray[r*ncols + c] = (2*rgba[r*4*ncols+4*c+0]+7*rgba[r*4*ncols+4*c+1]+1*rgba[r*4*ncols+4*c+2])/10;
				return gray;
			}
			/*
				(4) this function is called each time a video frame becomes available
			*/
			var processfn = async function(video, dt) {
				var vRatio = (canvas.height / video.videoHeight) * video.videoWidth;
                ctx.drawImage(video, 0,0, vRatio, canvas.height);
                // fill horizontally  
				var hRatio = (canvas.width / video.videoWidth) * video.videoHeight;
				
                ctx.drawImage(video, 0,0, canvas.width, hRatio);
				// render the video frame to the canvas element and extract RGBA pixel data
				var rgba = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
				// prepare input to `run_cascade`
				image = {
					"pixels": rgba_to_grayscale(rgba, canvasHeight, canvasWidth),
					"nrows": canvasHeight,
					"ncols": canvasWidth,
					"ldim": canvasWidth
				}
				params = {
					"shiftfactor": 0.1, // move the detection window by 10% of its size
					"minsize": 100,     // minimum size of a face
					"maxsize": 5000,    // maximum size of a face
					"scalefactor": 1.1  // for multiscale processing: resize the detection window by 10% when moving to the higher scale
				}
				// run the cascade over the frame and cluster the obtained detections
				// dets is an array that contains (r, c, s, q) quadruplets
				// (representing row, column, scale and detection score)
				dets = pico.run_cascade(image, facefinder_classify_region, params);
				dets = update_memory(dets);
                dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
                
				// draw detections
				for(i=0; i<dets.length; ++i) {
					
                    const iterationTick = Date.now();
					// check the detection score
					// if it's above the threshold, draw it
                    // (the constant 50.0 is empirical: other cascades might require a different one)
					//if (!failedStatus && iterationTick - failedStatusTick  > 10000) {
					//	failedStatus = true;
					//} 
					//if (failedStatus) {
						// ctx.clearRect(0, 0, canvasWidth, canvasHeight);
						// // canvas.height = 0;
						// // canvas.width = 0;
						// canvas.style.display = "none";
						// this.stop();
						// swal.fire(
						// 	"Failed",
						// 	"Unfortunately, your face recognition is failed.Please try again",
						// 	'error'
						// )
					//}
					if(dets[i][3] > 40.0)
					{
                        const faceArea = Math.PI * Math.pow(dets[i][2]/2 , 2);
                        const webcamArea  = canvasWidth * canvasHeight;
						const facePercentage = (faceArea * 100) / webcamArea;

						
						
                        if (facePercentage < 20) {
                            cameraStartTick = iterationTick;
                            snapshotTickCompleted = false;
							draw("Move Closer")
                        } 
                        else  if (facePercentage > 35){
                            cameraStartTick = iterationTick;
                            snapshotTickCompleted = false;
							draw("Move Away");
                        }
                        else {
                            if (!snapshotTickCompleted && !failedStatus && iterationTick - cameraStartTick >= 3000) {
								var snapshot = canvas.toDataURL('image/jpeg',1);
								
								const editedSnap = await encodeImage(accessToken, snapshot);
								 ctx.clearRect(0, 0, canvasWidth, canvasHeight);
								// canvas.height = 0;
								// canvas.width = 0;
								canvas.style.display = "none";
								this.stop();
								document.getElementById("loader").style.display = "block";
								getScoringData(editedSnap).then((res) => {
									console.log(personData);
									if (res.opDesc == 'ok') {
										if (res.result.facialScore && res.result.isMatched) {
											Swal.fire({
												title: "Verified",
												icon: "success",
												html:`<p>Dear <span id="nameText">${personData.firstname.toLowerCase()} ${personData.lastname.toLowerCase()}</span>, identity has been approved!</p>`,
											}).then((result) => {
												if (result.value) {
													window.location.href = "https://demo.verifie.ai"
												}
											  });
										} else {
											Swal.fire(
												'Not Verified',
												'Unfortunately, your face recognition is failed. Please try again.',
												'error'
												)
										}
										
										//
									} else {
										Swal.fire(
										"Something went wrong.",
										res.opDesc,
										'error'
										)
									}
								}).finally(() => {
									document.getElementById("loader").style.display = "none";
								});	
                                snapshotTickCompleted = true;
								failedStatusTick = iterationTick;
								failedStatus = false;
							}
							draw("Hold Still")
                        }
						// ctx.beginPath();
						// ctx.arc(dets[i][1], dets[i][0], dets[i][2]/2, 0, 2*Math.PI, false);
						// ctx.lineWidth = 3;
						// ctx.strokeStyle = 'green';
						// ctx.stroke();
					} else {
						// Alert.style.display = "none"
						// AlertText.innerText = "Hold Still"
					}
                }
                
			}
            
            let snapshotTickCompleted = false;
			let failedStatus = false;
            var mycamvas = new camvas(ctx, processfn);
            initialized = true;
        }

		function handleDocumentPhotoClick() {
			document.getElementById("content").style.display = "none";
			var canvas = document.getElementsByTagName('canvas')[0];
			canvas.width = window.innerWidth < 900 ? window.innerWidth - 20 : 600 ;
			canvas.height = window.innerWidth < 900 ? 220 : 400 ;
			canvas.style.display = "block"
			var ctx = canvas.getContext('2d');
			Documentcamvas = new camvas(ctx, (video ) => {
				var vRatio =  (canvas.height / video.videoHeight) * video.videoWidth;
                ctx.drawImage(video, 0,0, vRatio, canvas.height);
                // fill horizontally  
				var hRatio = (canvas.width / video.videoWidth) * video.videoHeight;
				
				ctx.drawImage(video, 0,0, canvas.width, hRatio);
			});
			document.getElementById("takePhotoBTN").style.display = "none"
			if (documentType === "passport") {
				Swal.fire(
					"Passport scan",
					"Scan the data page of passport",
					"info"
				);
			} else {
				Swal.fire(
					"Front Side",
					"Scan the front side of the document",
					"info"
				);
			}
			
			document.getElementById("captureBTN").style.display = "block"
		}

		const encodeImage = async (text,src) => {
			const startSrc =  src.split(',')[1];
			const encoder = new TextEncoder();
			// const stegger = new f5stego(key);
			
			const encodedText = encoder.encode(text);
			const uint8 = new Base64().decode(startSrc);

			

				let res = []
				try {
					const res =  doEmbed(uint8,encodedText);
					encodedImg =res;
					return res;
				} catch (err) {
					alert(err);
					return 0
				}
		}

		const decodeImage = (src) => {
			const uint8 = new Base64().decode(src);
			try {
				const res =  doExtract(uint8);
				alert(res);
				return res;
			} catch (err) {
				alert(err);
				return 0
			}
		}

		const handleCaptureDocument = async () => {
			document.getElementById("loader").style.display = "block";
			var canvas = document.getElementsByTagName('canvas')[0];
			var snapshot = canvas.toDataURL('image/jpeg',1);
			
			const editedSnap = await encodeImage(accessToken, snapshot);
			if (editedSnap) {
				getDocumentData(editedSnap).then((res) => {
					if (res.opDesc === "ok") {
						if (res.result.documentType === "passport" || res.result.documentType === "idCard" && !res.result.nextPage) {
							document.getElementById("captureBTN").style.display = "none";
							document.getElementById("canvas").style.display = "none";
							personData = res.result;
							Swal.fire({
								title: "Selfie",
								icon: "info",
								text: "Make selfie"
							}).then((result) => {
								if (result.value) {
									canvasMode = "mobile";
									Documentcamvas.stop();
									button_callback();
								}
							  });
						} else if (res.result.documentType === "idCard" && res.result.nextPage) {
							Swal.fire(
								"Opposite Side",
								"Scan the opposite side of the document",
								"info"
							  );
						}
					} else {
						Swal.fire({
							title: "Something went wrong",
							text: res.opDesc,
							icon: 'error',
						})
					}
				}).finally(() => {
					//swal("","","info")
					document.getElementById("loader").style.display = "none";
				})
			}
			
		}

		function handleImageClick(event) {
			const input = event.target.parentNode.parentNode.querySelectorAll("input[type='radio']")[0];
			input.click();
			const container = event.target.tagName === 'IMG' || event.target.tagName === "P" ? event.target.parentNode : event.target;
			const imgContainers = document.querySelectorAll('.img-container');
			imgContainers.forEach((item) => {
				if(item.classList.value.includes('active')) {
					item.classList.remove('active');
				}
			})
			container.classList.add('active');

			documentType = container.parentElement.children[0].value;

			if (documentType === 'idCard') {
				const backBtnSection = document.getElementById('backSide');
				//backBtn.style.display = "block";
			} else {
				const backBtnSection = document.getElementById('backSide');
				backBtnSection.style.display = "none";
			}
		}

		function toBase64 (file) {return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		})};
