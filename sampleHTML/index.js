(function (window, document) {
  let tr = lang.en;

  let initialized = false;
  let documentType = "passport";

  let personData = null;
  window.canvasMode = "pc";
  let encodedImg = "";
  let DocumentCamvas;
  const Ratio = 0.8;

  const fillStaticContent = function () {
    if (!tr) {
      tr = lang.en;
    }
    document.getElementById("takePhotoBtn").innerHTML = tr.takePhotoBtnText;
    document.getElementById("passportText").innerHTML = tr.passportText;
    document.getElementById("idCardText").innerHTML = tr.idCardText;
    document.getElementById("orText").innerHTML = tr.orText;
    document.getElementById("uploadSecondPage").innerHTML =
      tr.uploadSecondPageText;
    document.getElementById("captureBtn").innerHTML = tr.captureBtnText;
    document.getElementById("uploadFirstPage").innerHTML =
      tr.uploadFirstPageText;
  };
  fillStaticContent();

  window.setLanguage = function (ln, lnValues) {
    if (!lang[ln]) {
      return "Invalid language";
    }
    tr = lang[ln];
    if (lnValues) {
      Object.keys(lnValues).forEach(function (lnKey) {
        if (tr[lnKey]) {
          tr[lnKey] = lnValues[lnKey];
        }
      });
    }

    fillStaticContent();
  };

  window.readTextFile = function (file) {
    const rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          alert(rawFile.responseText);
        }
      }
    };
    rawFile.send(null);
  };

  const dist = function (x0, y0, z0, x1, y1, z1) {
    const deltaX = x1 - x0;
    const deltaY = y1 - y0;
    const deltaZ = z1 - z0;
    const distance = Math.sqrt(
      deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ
    );
    return distance;
  };
  
  const cosine = function cosinesim(A,B){
    var dotproduct=0;
    var mA=0;
    var mB=0;
    for(i = 0; i < A.length; i++){
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct)/(mA)*(mB)
    return similarity;
  };

  CanvasRenderingContext2D.prototype.roundedRectangle = function (
    x,
    y,
    w,
    h,
    r
  ) {
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    this.beginPath();

    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();

    return this;
  };

  const draw = function (text) {
    const drawing = document.getElementById("canvasTxt");
    const con = drawing.getContext("2d");
	con.clearRect(0, 0, drawing.width, drawing.height);
    //clear background
    con.fillStyle = "#eef6fe9e";
    const rect = con.roundedRectangle(
      20,
      20,
      con.measureText(text).width + 40,
      60,
      20
    );
    rect.stroke();
    rect.fill();
    con.fillStyle = "black";
    con.font = "20pt 'Roboto'";
	
    con.fillText(text, 40, 60);
	
  };

  window.buttonCallback = async function () {
    document.getElementsByClassName("canvas-outer")[0].style.display = "block";
	document.getElementById("canvasTxt").style.display = "block";
    /*
      (0) check whether we're already running face detection
    */
    if (initialized) {
      return;
    } // if yes, then do not initialize everything again
    window.canvasMode = "mobile";
    const canvas = document.getElementsByTagName("canvas")[0];
	const canvasTxt = document.getElementById("canvasTxt");
    const canvasWidth = window.innerWidth < 900 ? window.innerWidth - 30 : 640;
    const canvasHeight =
      window.innerWidth < 900 ? (window.innerWidth - 20) / Ratio : 480;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    
    const faceOptions = {
      firstFixedPos: 0,
      lastFixedPos: 0,
      nearPosNose: 0,
      farPosNose: 0,
      noseEye: 0,
      nearNoseEye: 0,
      straightInd: 0,
      iterationTick: Date.now(),
      snapshotTickCompleted: false,
      failedStatus: false,
	  embedding1: Array(),
	  embedding2: Array(),
    };

    const canvasOptions = {
      ctx: ctx,
      canvas: canvas,
	  canvasTxt: canvasTxt,
      width: canvasWidth,
      height: canvasHeight,
    };

    await tf.setBackend("wasm");
    await tf.ready();
    // load facemesh model
    const model = await facemesh.load({
      maxFaces: 1,
      detectionConfidence: 0.95,
    });

    const processFn = async function (video, dt) {
      if (video.readyState == 4) {
        initialized = true;
		
        const vRatio = (canvas.height / video.videoHeight) * video.videoWidth;
        ctx.drawImage(video, 0, 0, vRatio, canvas.height);
		
        // fill horizontally
        const hRatio = (canvas.width / video.videoWidth) * video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, hRatio);
		
        const dets = await model.estimateFaces(video);
        // draw detections
        if (dets.length > 0) {
          if (!faceOptions.snapshotTickCompleted) {
			faceOptions.iterationTick = Date.now();
            processSnapshotTick(
              canvasOptions,
              faceOptions,
			  video,
              dets,
              draw,
              dist,
              tr,
			  cosine
            );
			
			
            if (
              faceOptions.snapshotTickCompleted &&
              !faceOptions.failedStatus
            ) {
			  const dotProduct = faceOptions.embedding1.map((val, i) => val * faceOptions.embedding2[i]).reduce((accum, curr) => accum + curr, 0);
			  const vec1Size = Math.sqrt(faceOptions.embedding1.reduce((accum, curr) => accum + Math.pow(curr, 2), 0));
              const vec2Size = Math.sqrt(faceOptions.embedding2.reduce((accum, curr) => accum + Math.pow(curr, 2), 0));

              similarity = (((dotProduct / (vec1Size * vec2Size))*100)-99)*100;
              if (similarity > 70){
				  const snapshot = canvas.toDataURL("image/jpeg", 1);

				  const editedSnap = await encodeImage(accessToken, snapshot);
				  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				  canvas.style.display = "none";
				  canvasTxt.style.display = "none";
				  this.stop();
				  document.getElementById("loader").style.display = "block";
				  try {
					const scoringDataRes = await getScoringData(editedSnap);
					
					if (scoringDataRes.opDesc == "ok") {
					  if (
						scoringDataRes.result.isMatched &&
						scoringDataRes.result.facialLiveness
					  ) {
						const swapFireRes = await Swal.fire({
						  title: tr.verifiedText,
						  icon: "success",
						  html: `<p>Dear <span id="nameText">${personData.firstname.toLowerCase()} ${personData.lastname.toLowerCase()}</span>, identity has been approved!</p>`,
						});
						if (swapFireRes.value) {
						  window.location.href = "https://demo.verifie.ai/v2/";
						}
					  } else {
						  document.getElementById("content").style.display =
							"block";
						  document.getElementById("uploadFirstPage").style.display =
							"block";
						  document.getElementsByClassName(
							"canvas-outer"
						  )[0].style.display = "none";
						  const swapFireRes = await Swal.fire(
							  tr.notVerifiedText,
							  tr.faceVerificationFailedText,
							  "error"
							);
						  if (swapFireRes.value) {
							  window.location.href = "https://demo.verifie.ai/v2/";
						  }
					  }
					} else {
					  Swal.fire(tr.exceptionText, scoringDataRes.opDesc, "error");
					}
				  } finally {
					document.getElementById("loader").style.display = "none";
				  }
				  faceOptions.snapshotTickCompleted = true;
				  window.failedStatusTick = faceOptions.iterationTick;
				  faceOptions.failedStatus = false;
			  
			  }
			  else {
				  faceOptions.failedStatus = true;
			  }
            }
          } else if (
				faceOptions.snapshotTickCompleted &&
				faceOptions.failedStatus
				) {
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				canvas.style.display = "none";
				canvasTxt.style.display = "none";
				this.stop();
				document.getElementById("content").style.display = "block";
				document.getElementById("uploadFirstPage").style.display = "block";
				document.getElementsByClassName("canvas-outer")[0].style.display =
				  "none";
				const swapFireRes = await Swal.fire(
					  tr.notVerifiedText,
					  tr.faceVerificationFailedText,
					  "error"
					);
				if (swapFireRes.value) {
					window.location.href = "https://demo.verifie.ai/v2/";
				}
          }
        } else {
          draw(tr.frameFaceText);
        }
      }
    };

    new camvas(ctx, processFn);
    initialized = true;
  };

  window.handleDocumentPhotoClick = function () {
    document.getElementById("content").style.display = "none";
    document.getElementById("uploadFirstPage").style.display = "none";
    document.getElementsByClassName("canvas-outer")[0].style.display = "block";
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.width = window.innerWidth < 900 ? window.innerWidth - 20 : 600;
    canvas.height = window.innerWidth < 900 ? 220 : 400;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    DocumentCamvas = new camvas(ctx, function (video) {
      const vRatio = (canvas.height / video.videoHeight) * video.videoWidth;
      ctx.drawImage(video, 0, 0, vRatio, canvas.height);
      // fill horizontally
      const hRatio = (canvas.width / video.videoWidth) * video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, hRatio);
    });
    document.getElementById("takePhotoBtn").style.display = "none";
    if (documentType === "passport") {
      Swal.fire(tr.passportScanText, tr.passportScanDescText, "info");
    } else {
      Swal.fire(tr.idScanText, tr.idScanDescText, "info");
    }
    document.getElementById("captureBtn").style.display = "block";
  };

  const encodeImage = async function (text, src) {
    const startSrc = src.split(",")[1];
    const encoder = new TextEncoder();

    const encodedText = encoder.encode(text);
    const uint8 = new Base64().decode(startSrc);

    try {
      const res = doEmbed(uint8, encodedText);
      encodedImg = res;
      return res;
    } catch (err) {
      alert(err);
      return 0;
    }
  };

  window.decodeImage = function (src) {
    const uint8 = new Base64().decode(src);
    try {
      const res = doExtract(uint8);
      alert(res);
      return res;
    } catch (err) {
      alert(err);
      return 0;
    }
  };

  window.handleUploadDocument = async function () {
    document.getElementById("content").style.display = "none";
    document.getElementById("uploadFirstPage").style.display = "none";
    const file = document.getElementById("document1").files[0];
    const parsedFile = await toBase64(file);
    validateDocument(parsedFile, true);
  };

  window.handleUploadDocumentBackSide = async function () {
    const file = document.getElementById("document2").files[0];
    const parsedFile = await toBase64(file);
    validateDocument(parsedFile, true);
  };

  window.handleCaptureDocument = async function () {
    document.getElementById("loader").style.display = "block";
    const canvas = document.getElementsByTagName("canvas")[0];
    const snapshot = canvas.toDataURL("image/jpeg", 1).split(",")[1];	
    validateDocument(snapshot);
  };
  
  const validateDocument = async function (editedSnap, isUpload = false) {
    document.getElementById("loader").style.display = "block";
    const documentDataRes = await getDocumentData(editedSnap);
    try {
      if (documentDataRes.opDesc === "ok") {
        if (
          documentDataRes.result.documentType === "passport" ||
          (documentDataRes.result.documentType === "idCard" &&
            !documentDataRes.result.nextPage)
        ) {
		  if (documentType === "idCard" && documentDataRes.result.documentType === "passport") {
				document.getElementById("content").style.display = "block";
				document.getElementById("uploadFirstPage").style.display = "block";
				Swal.fire({
				title: tr.exceptionText,
				text: tr.exceptionDocumentText,
				icon: "error",
				});
		  } else {
			  document.getElementById("captureBtn").style.display = "none";
			  document.getElementById("canvas").style.display = "none";
			  document.getElementById("uploadSecondPage").style.display = "none";
			  personData = documentDataRes.result;
			  const swapFireRes = await Swal.fire({
				title: tr.selfieText,
				icon: "info",
				text: tr.makeSelfieText,
			  });
			  if (swapFireRes.value) {
				window.canvasMode = "mobile";
				if (!isUpload) {
				  DocumentCamvas.stop();
				}
				buttonCallback();
			  }
		  }
        } else if (
          documentDataRes.result.documentType === "idCard" &&
          documentDataRes.result.nextPage
        ) {
			if (documentType === "passport") {
				document.getElementById("content").style.display = "block";
				document.getElementById("uploadFirstPage").style.display = "block";
				Swal.fire({
				title: tr.exceptionText,
				text: tr.exceptionDocumentText,
				icon: "error",
				});
			}
			else {
			  const message = isUpload
				? tr.uploadoppositeText
				: tr.oppositeText;
			  await Swal.fire(tr.oppositeSideText, message, "info");
			  document.querySelector("#document2").click();

			  if (isUpload) {
				document.getElementById("content").style.display = "none";
				document.getElementById("uploadFirstPage").style.display = "none";
				document.getElementById("backSideDocContent").style.display =
				  "block";
			  }
			}
        }
      } else {
		document.getElementById("content").style.display = "block";
        document.getElementById("uploadFirstPage").style.display = "block";
        Swal.fire({
          title: tr.exceptionText,
          text: documentDataRes.opDesc,
          icon: "error",
        });
      }
    } finally {
      //swal("","","info")
      document.getElementById("loader").style.display = "none";
    }
  };

  window.handleImageClick = function (event) {
    const input = event.target.parentNode.parentNode.querySelectorAll(
      "input[type='radio']"
    )[0];
    input.click();
    const container =
      event.target.tagName === "IMG" || event.target.tagName === "P"
        ? event.target.parentNode
        : event.target;
    const imgContainers = document.querySelectorAll(".img-container");
    imgContainers.forEach(function (item) {
      if (item.classList.value.includes("active")) {
        item.classList.remove("active");
      }
    });
    container.classList.add("active");

    documentType = container.parentElement.children[0].value;

    if (documentType === "idCard") {
      const backBtnSection = document.getElementById("backSide");
    } else {
      const backBtnSection = document.getElementById("backSide");
      backBtnSection.style.display = "none";
    }
  };

  const toBase64 = async function (file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  };
})(window, document);
