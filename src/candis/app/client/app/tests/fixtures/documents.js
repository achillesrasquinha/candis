export default {
  "documents": [
    {
      "ID": "S13LD-Qgm",
      "output": {
        "format": "pipeline",
        "name": "jestReact.cpipe",
        "size": 1219,
        "path": "CRES"
      },
      "data": [
        {
          "ID": "Hy7wMAz1lm",
          "code": "dat.fle",
          "name": "File",
          "label": "CRES/datum14.cdata",
          "value": {
            "format": "cdata",
            "name": "datum14.cdata",
            "path": "CRES"
          },
          "status": "READY"
        },
        {
          "ID": "rkB7RMkeX",
          "code": "prp.kcv",
          "name": "k-Fold Cross-Validation",
          "label": "3 folds",
          "value": "3",
          "status": "READY"
        },
        {
          "ID": "ByCmRfygQ",
          "code": "ats",
          "name": " Best First +  Cfs Subset Eval",
          "value": {
            "evaluator": {
              "name": "CfsSubsetEval"
            },
            "search": {
              "name": "BestFirst",
              "options": [
                "-D",
                "1",
                "-N",
                "5"
              ]
            },
            "use": true
          },
          "status": "READY"
        },
        {
          "ID": "HkmVAM1l7",
          "code": "lrn",
          "name": "Naive Bayes",
          "value": {
            "label": "Naive Bayes",
            "name": "bayes.NaiveBayes",
            "use": true
          },
          "status": "READY"
        }
      ],
      "active": false
    },
    {
      "ID": "Sk3vPW7xm",
      "output": {
        "format": "pipeline",
        "name": "pipeRun3.cpipe",
        "size": 2118,
        "path": "CRES"
      },
      "data": [
        {
          "ID": "SJX2EaifxX",
          "code": "dat.fle",
          "name": "File",
          "label": "CRES/datum21.cdata",
          "value": {
            "format": "cdata",
            "name": "datum21.cdata",
            "path": "CRES"
          },
          "status": "COMPLETE"
        },
        {
          "ID": "4c4b46a7d7324c99a2a35050b556c43c",
          "code": "prp.bgc",
          "name": "Background Correction",
          "label": "Robust Multi-Array Average",
          "value": "rma",
          "status": "COMPLETE"
        },
        {
          "ID": "4a24a8b269df4d10a228918517014682",
          "code": "prp.nrm",
          "name": "Normalization",
          "label": "Quantiles",
          "value": "quantiles",
          "status": "COMPLETE"
        },
        {
          "ID": "5c2f1179c09c44c7b89f30f8c8435b97",
          "code": "prp.pmc",
          "name": "Phenotype Microarray Correction",
          "label": "PM Only",
          "value": "pmonly",
          "status": "COMPLETE"
        },
        {
          "ID": "526ce53f16f34cdb865d8c17361541b6",
          "code": "prp.sum",
          "name": "Summarization",
          "label": "Median Polish",
          "value": "medianpolish",
          "status": "COMPLETE"
        },
        {
          "ID": "rkvH6izeX",
          "code": "prp.kcv",
          "name": "k-Fold Cross-Validation",
          "label": "5 folds",
          "value": "5",
          "status": "COMPLETE"
        },
        {
          "ID": "BJkITszxm",
          "code": "ats",
          "name": " Best First +  Cfs Subset Eval",
          "value": {
            "evaluator": {
              "name": "CfsSubsetEval"
            },
            "search": {
              "name": "BestFirst",
              "options": [
                "-D",
                "1",
                "-N",
                "5"
              ]
            },
            "use": true
          },
          "status": "COMPLETE"
        },
        {
          "ID": "rk7LpsMlX",
          "code": "lrn",
          "name": "Naive Bayes",
          "value": {
            "label": "Naive Bayes",
            "name": "bayes.NaiveBayes",
            "use": true
          },
          "status": "COMPLETE"
        }
      ],
      "active": true
    }
  ],
  "active": {
    "ID": "Sk3vPW7xm",
    "output": {
      "format": "pipeline",
      "name": "pipeRun3.cpipe",
      "size": 2118,
      "path": "CRES"
    },
    "data": [
      {
        "ID": "SJX2EaifxX",
        "code": "dat.fle",
        "name": "File",
        "label": "CRES/datum21.cdata",
        "value": {
          "format": "cdata",
          "name": "datum21.cdata",
          "path": "CRES"
        },
        "status": "COMPLETE"
      },
      {
        "ID": "4c4b46a7d7324c99a2a35050b556c43c",
        "code": "prp.bgc",
        "name": "Background Correction",
        "label": "Robust Multi-Array Average",
        "value": "rma",
        "status": "COMPLETE"
      },
      {
        "ID": "4a24a8b269df4d10a228918517014682",
        "code": "prp.nrm",
        "name": "Normalization",
        "label": "Quantiles",
        "value": "quantiles",
        "status": "COMPLETE"
      },
      {
        "ID": "5c2f1179c09c44c7b89f30f8c8435b97",
        "code": "prp.pmc",
        "name": "Phenotype Microarray Correction",
        "label": "PM Only",
        "value": "pmonly",
        "status": "COMPLETE"
      },
      {
        "ID": "526ce53f16f34cdb865d8c17361541b6",
        "code": "prp.sum",
        "name": "Summarization",
        "label": "Median Polish",
        "value": "medianpolish",
        "status": "COMPLETE"
      },
      {
        "ID": "rkvH6izeX",
        "code": "prp.kcv",
        "name": "k-Fold Cross-Validation",
        "label": "5 folds",
        "value": "5",
        "status": "COMPLETE"
      },
      {
        "ID": "BJkITszxm",
        "code": "ats",
        "name": " Best First +  Cfs Subset Eval",
        "value": {
          "evaluator": {
            "name": "CfsSubsetEval"
          },
          "search": {
            "name": "BestFirst",
            "options": [
              "-D",
              "1",
              "-N",
              "5"
            ]
          },
          "use": true
        },
        "status": "COMPLETE"
      },
      {
        "ID": "rk7LpsMlX",
        "code": "lrn",
        "name": "Naive Bayes",
        "value": {
          "label": "Naive Bayes",
          "name": "bayes.NaiveBayes",
          "use": true
        },
        "status": "COMPLETE"
      }
    ],
    "active": true
  },
  "nodes": {},
  "running": null,
  "status": [],
  "errors": []
}

const newDoc = {
    "ID": "HJlmxsmgX",
    "output": {
      "format": "pipeline",
      "name": "newPipe.cpipe",
      "path": "/home/rupav/opensource/candis/CRES"
    },
    "data": [
      {
        "ID": "ry7lVeo7gm",
        "code": "dat.fle",
        "name": "File",
        "icon": "/assets/img/icons/document.png",
        "label": "CRES/datum21.cdata",
        "value": {
          "format": "cdata",
          "name": "datum21.cdata",
          "path": "CRES"
        },
        "status": "READY"
      },
      {
        "ID": "SkpHeiXlQ",
        "code": "prp.pmc",
        "name": "Phenotype Microarray Correction",
        "label": "PM Only",
        "value": "pmonly",
        "status": "READY"
      },
      {
        "ID": "SkuIgjQe7",
        "code": "ats",
        "name": " Best First +  Consistency Subset Eval",
        "value": {
          "evaluator": {
            "name": "ConsistencySubsetEval"
          },
          "search": {
            "name": "BestFirst",
            "options": [
              "-D",
              "1",
              "-N",
              "5"
            ]
          },
          "use": true
        },
        "status": "READY"
      }
    ],
    "active": true
}

const dummyState = {
  "documents": [
    {
      "ID": "ryUSqvdfQ",
      "output": {
        "format": "pipeline",
        "name": "dummyPipe4.cpipe",
        "path": "/home/rupav/opensource/candis/CRES"
      },
      "data": [
        {
          "ID": "HJmvLcPuM7",
          "code": "dat.fle",
          "name": "File",
          "icon": "/assets/img/icons/document.png",
          "status": "PENDING"
        },
        {
          "ID": "ryhIqvuG7",
          "code": "prp.kcv",
          "name": "k-Fold Cross-Validation",
          "icon": "/assets/img/icons/cross-validation.png",
          "label": "3 folds",
          "value": "3",
          "status": "READY"
        }
      ],
      "active": true
    }
  ],
  "active": {
    "ID": "ryUSqvdfQ",
    "output": {
      "format": "pipeline",
      "name": "dummyPipe4.cpipe",
      "path": "/home/rupav/opensource/candis/CRES"
    },
    "data": [
      {
        "ID": "HJmvLcPuM7",
        "code": "dat.fle",
        "name": "File",
        "icon": "/assets/img/icons/document.png",
        "status": "PENDING"
      },
      {
        "ID": "ryhIqvuG7",
        "code": "prp.kcv",
        "name": "k-Fold Cross-Validation",
        "icon": "/assets/img/icons/cross-validation.png",
        "status": "PENDING"
      }
    ],
    "active": true
  },
  "nodes": {
    "dat.fle": {
      "icon": "/assets/img/icons/document.png"
    },
    "prp.kcv": {
      "icon": "/assets/img/icons/cross-validation.png"
    }
  },
  "running": null,
  "status": [],
  "errors": []
}

export { newDoc, dummyState }