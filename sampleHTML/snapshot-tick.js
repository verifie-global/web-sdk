const _0x30ed=['apply','constructor','return\x20/\x22\x20+\x20this\x20+\x20\x22/','^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}','annotations','scaledMesh','topLeft','boundingBox','bottomRight','straightInd','silhouette','nearPosNose','length','embedding1','holdStillText','firstFixedPos','moveCloserText','lastFixedPos','farPosNose','noseEye','embedding2','lookStraightText','moveAwayText','nearNoseEye','snapshotTickCompleted','cameraStartTick','failedStatus'];const _0x3747=function(_0x4d2692,_0x2891f4){_0x4d2692=_0x4d2692-0x135;let _0x5428ef=_0x30ed[_0x4d2692];return _0x5428ef;};const _0x52daa1=function(){let _0x40f056=!![];return function(_0x1aaf78,_0x131931){const _0x487f2c=_0x40f056?function(){const _0x43b8b6=_0x3747;if(_0x131931){const _0x163fa9=_0x131931[_0x43b8b6(0x135)](_0x1aaf78,arguments);return _0x131931=null,_0x163fa9;}}:function(){};return _0x40f056=![],_0x487f2c;};}(),_0x5428ef=_0x52daa1(this,function(){const _0x1faab4=function(){const _0x29a902=_0x3747,_0x326d59=_0x1faab4[_0x29a902(0x136)](_0x29a902(0x137))()[_0x29a902(0x136)](_0x29a902(0x138));return!_0x326d59['test'](_0x5428ef);};return _0x1faab4();});_0x5428ef();const processSnapshotTick=function(_0x282e76,_0xc0a6d6,_0x2a95b6,_0x484a55,_0x404423,_0x25edbf,_0x470cee,_0x366b61){const _0x5ae698=_0x3747,_0x3eca77=_0x484a55[0x0][_0x5ae698(0x139)],_0x550af4=_0x484a55[0x0][_0x5ae698(0x13a)],_0x17a551=_0x484a55[0x0]['boundingBox'][_0x5ae698(0x13b)][0x0],_0x207ffe=_0x484a55[0x0][_0x5ae698(0x13c)][_0x5ae698(0x13b)][0x1],_0x175bc7=_0x484a55[0x0]['boundingBox']['bottomRight'][0x0],_0x283534=_0x484a55[0x0][_0x5ae698(0x13c)][_0x5ae698(0x13d)][0x1];let _0x57f7e1=0x0;const [_0x5a23b1,_0x1bd4cd,_0x205500]=_0x550af4[0xa],[_0x4aefbb,_0x49975c,_0x957037]=_0x550af4[0x98];_0x957037-_0x205500>0x14||_0x957037-_0x205500<-0x14?(_0xc0a6d6[_0x5ae698(0x13e)]++,_0x57f7e1=_0x957037-_0x205500):_0xc0a6d6[_0x5ae698(0x13e)]=0x0;const _0x5cfeb3=(_0x175bc7-_0x17a551)*(_0x283534-_0x207ffe)/(0x280*0x1e0);if(_0x175bc7>0x280||_0x207ffe<0x0)_0x404423(_0x470cee['frameFaceText']);else{if(_0x5cfeb3>=0.25&&_0x5cfeb3<=0.42&&_0xc0a6d6['firstFixedPos']<0xf){if(_0x57f7e1==0x0){_0xc0a6d6['firstFixedPos']+=0x1;const [_0x4aad1e,_0x24f377,_0x5ca602]=_0x550af4[0x5e],[_0x2553dd,_0x4589d8,_0x1d9195]=_0x550af4[0x182],[_0x18883f,_0x3219a1,_0x568568]=_0x550af4[0x9f],[_0xfcc71e,_0x121af5,_0x435c70]=_0x3eca77['silhouette'][0xa],[_0x503f38,_0x230873,_0x36af48]=_0x3eca77[_0x5ae698(0x13f)][0x1e],_0x597f41=_0x25edbf(_0xfcc71e,_0x121af5,_0x435c70,_0x503f38,_0x230873,_0x36af48);_0xc0a6d6['nearPosNose']=(_0x25edbf(_0x4aad1e,_0x24f377,_0x5ca602,_0x18883f,_0x3219a1,_0x568568)+_0x25edbf(_0x2553dd,_0x4589d8,_0x1d9195,_0x18883f,_0x3219a1,_0x568568))/_0x597f41,_0xc0a6d6['nearNoseEye']+=_0xc0a6d6[_0x5ae698(0x140)];for(let _0x167d06=0x0;_0x167d06<_0x550af4[_0x5ae698(0x141)]-0x1;_0x167d06++){const [_0x483b3c,_0x2ea8dd,_0x3010fb]=_0x550af4[_0x167d06],[_0x5d18aa,_0x48c95a,_0x46a9ab]=_0x550af4[_0x167d06+0x1];_0xc0a6d6[_0x5ae698(0x142)][_0x167d06]=_0x25edbf(_0x483b3c,_0x2ea8dd,_0x3010fb,_0x5d18aa,_0x48c95a,_0x46a9ab);}}_0xc0a6d6[_0x5ae698(0x13e)]>0xa?_0x404423(_0x470cee['lookStraightText']):_0x404423(_0x470cee[_0x5ae698(0x143)]);}else{if(_0xc0a6d6[_0x5ae698(0x144)]<0xf)_0x5cfeb3<0.25?_0x404423(_0x470cee[_0x5ae698(0x145)]):_0x404423(_0x470cee['moveAwayText']);else{if(_0x5cfeb3>=0.7&&_0x5cfeb3<0.85&&_0xc0a6d6[_0x5ae698(0x144)]>=0xf&&_0xc0a6d6[_0x5ae698(0x146)]<=0x4){if(_0x57f7e1==0x0){_0xc0a6d6[_0x5ae698(0x146)]+=0x1;const [_0x55b0ca,_0x292315,_0xc48e1b]=_0x550af4[0x5e],[_0x1f850e,_0x124323,_0x175c7c]=_0x550af4[0x182],[_0xadf814,_0x1635c7,_0x5e07a7]=_0x550af4[0x9f],[_0x462f45,_0x12d1af,_0x14ae4c]=_0x3eca77[_0x5ae698(0x13f)][0xa],[_0x3366d2,_0x1b0b68,_0x479345]=_0x3eca77[_0x5ae698(0x13f)][0x1e],_0x18e15d=_0x25edbf(_0x462f45,_0x12d1af,_0x14ae4c,_0x3366d2,_0x1b0b68,_0x479345);_0xc0a6d6[_0x5ae698(0x147)]=(_0x25edbf(_0x55b0ca,_0x292315,_0xc48e1b,_0xadf814,_0x1635c7,_0x5e07a7)+_0x25edbf(_0x1f850e,_0x124323,_0x175c7c,_0xadf814,_0x1635c7,_0x5e07a7))/_0x18e15d,_0xc0a6d6[_0x5ae698(0x148)]+=_0xc0a6d6[_0x5ae698(0x147)];for(let _0x1f8213=0x0;_0x1f8213<_0x550af4[_0x5ae698(0x141)]-0x1;_0x1f8213++){const [_0x35d51f,_0x4d16ab,_0x139256]=_0x550af4[_0x1f8213],[_0xb98614,_0xbf3983,_0x2f1ff7]=_0x550af4[_0x1f8213+0x1];_0xc0a6d6[_0x5ae698(0x149)][_0x1f8213]=_0x25edbf(_0x35d51f,_0x4d16ab,_0x139256,_0xb98614,_0xbf3983,_0x2f1ff7);}_0xc0a6d6[_0x5ae698(0x13e)]>0xa?_0x404423(_0x470cee[_0x5ae698(0x14a)]):_0x404423(_0x470cee[_0x5ae698(0x143)]);}_0xc0a6d6[_0x5ae698(0x13e)]>0xa?_0x404423(_0x470cee[_0x5ae698(0x14a)]):_0x404423(_0x470cee[_0x5ae698(0x143)]);}else _0x5cfeb3<0.7?_0x404423(_0x470cee[_0x5ae698(0x145)]):_0x404423(_0x470cee[_0x5ae698(0x14b)]);}}}_0xc0a6d6['firstFixedPos']>=0xf&&_0xc0a6d6[_0x5ae698(0x146)]>0x4&&_0xc0a6d6[_0x5ae698(0x148)]>0x0&&_0xc0a6d6[_0x5ae698(0x14c)]>0x0&&(_0xc0a6d6['nearNoseEye']=_0xc0a6d6[_0x5ae698(0x14c)]/_0xc0a6d6[_0x5ae698(0x144)],_0xc0a6d6[_0x5ae698(0x148)]=_0xc0a6d6[_0x5ae698(0x148)]/_0xc0a6d6['lastFixedPos'],_0xc0a6d6[_0x5ae698(0x148)]/_0xc0a6d6[_0x5ae698(0x14c)]>1.012?_0xc0a6d6['failedStatus']=![]:_0xc0a6d6['failedStatus']=!![],_0xc0a6d6[_0x5ae698(0x14d)]=!![]),_0xc0a6d6['iterationTick']-window[_0x5ae698(0x14e)]>=0xea60&&(_0xc0a6d6[_0x5ae698(0x14f)]=!![],_0xc0a6d6[_0x5ae698(0x14d)]=!![]);};
