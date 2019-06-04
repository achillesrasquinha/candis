# imports - standard imports
import sys, os, warnings, io
import random
import threading
try:
    from io import StringIO # Python 3
except ImportError:
    from StringIO import StringIO # Python 2

# imports - third-party imports

import addict
import numpy   as np
import matplotlib.pyplot as pplt
import pandas  as pd, arff
import seaborn as sns

from weka.core                import jvm as JVM
from weka.core.converters     import Loader, Saver
from weka.core                import serialization as serializer
from weka.filters             import Filter
from weka.attribute_selection import ASSearch, ASEvaluation, AttributeSelection
from weka.classifiers         import Classifier, Evaluation
from weka.plot.classifiers    import plot_classifier_errors, plot_learning_curve, plot_roc, plot_prc

# imports - module imports
from candis.config import CONFIG
from candis.ios    import cdata
from candis.ios    import json as JSON
from candis.ios.pipeline.reader    import read
from candis.util   import assign_if_none, get_rand_uuid_str, get_b64_plot, buffer_to_b64, modify_test_path, modify_train_path


pplt.style.use('seaborn')

class Pipeline(object):
    CONFIG   = CONFIG.Pipeline

    PENDING  = 'PENDING'
    READY    = 'READY'
    RUNNING  = 'RUNNING'
    COMPLETE = 'COMPLETE'

    def __init__(self, config = { }):
        self.status  = Pipeline.PENDING
        self.config  = Pipeline.CONFIG
        self.thread  = None
        self.logs    = [ ]
        self.stages  = [ ]
        self.gist    = addict.Dict()

        self.set_config(config)

    def set_config(self, config):
        self.config.update(config)

    def set_status(self, status):
        self.status  = status

    def add_stages(self, *args):
        self.stages += args

        if any(stage.status == Pipeline.PENDING for stage in self.stages):
            self.set_status(Pipeline.PENDING)
        if all(stage.status == Pipeline.READY   for stage in self.stages):
            self.set_status(Pipeline.READY)

    # raise IOError, ValueError.
    def load(stages):
        # if not os.path.isabs(path):
        #     path     = os.path.abspath(path)

        # if not os.path.exists(path):
        #     raise IOError('{path} does not exist.'.format(path = path))
        # if not os.path.isfile(path):
        #     raise IOError('{path} is not a valid file.'.format(path = path))

        objekt       = Pipeline()
        # stages       = [addict.Dict(stage) for stage in read(path)]
        stages = [addict.Dict(stage) for stage in stages]
        if len(stages) == 0:
            raise ValueError('Pipeline is empty.')

        update       = [ ]

        fpath        = [addict.Dict(stage) for stage in stages if stage.code == 'dat.fle']
        if len(fpath) == 0:
            raise ValueError('No valid input found.')
        if len(fpath)  > 1:
            raise ValueError('More than one input file found.')
        fpath        = fpath[0]

        if any(stage.status == Pipeline.PENDING for stage in stages):
            raise ValueError('Resource pending.')

        dpath        = os.path.join(fpath.value.path, fpath.value.name)
        data         = None # cdata.read(dpath)
        fpath.status = Pipeline.READY
        objekt.add_stages(fpath)

        config       = addict.Dict()

        # Background Correction
        stageprpbgc  = [stage for stage in stages if stage.code.startswith('prp.bgc')]
        if len(stageprpbgc)  > 1:
            raise ValueError('More than one Background Correction method provided.')
        if len(stageprpbgc) == 0:
            stageprpbgc     = addict.Dict(
            {
                   'ID': get_rand_uuid_str(),
                 'code': 'prp.bgc',
                 'name': 'Background Correction',
                'value': 'rma',
                'label': 'Robust Multi-Array Average'
            })
        else:
            stageprpbgc     = stageprpbgc[0]
        stageprpbgc.status  = Pipeline.READY
        config.preprocess.background_correction \
        = stageprpbgc.value
        objekt.add_stages(stageprpbgc)

        # Normalization
        stageprpnrm  = [stage for stage in stages if stage.code.startswith('prp.nrm')]
        if len(stageprpnrm)  > 1:
            raise ValueError('More than one Normalization method provided.')
        if len(stageprpnrm) == 0:
            stageprpnrm     = addict.Dict({
                   'ID': get_rand_uuid_str(),
                 'code': 'prp.nrm',
                 'name': 'Normalization',
                'value': 'quantiles',
                'label': 'Quantiles'
            })
        else:
            stageprpnrm    = stageprpnrm[0]
        stageprpnrm.status = Pipeline.READY
        config.preprocess.normalization \
        = stageprpnrm.value
        objekt.add_stages(stageprpnrm)

        # Phenotype Microarray Correction
        stageprppmc  = [stage for stage in stages if stage.code.startswith('prp.pmc')]
        if len(stageprppmc)  > 1:
            raise ValueError('More than one Phenotype Microarray Correction method provided.')
        if len(stageprppmc) == 0:
            stageprppmc     = addict.Dict({
                   'ID': get_rand_uuid_str(),
                 'code': 'prp.pmc',
                 'name': 'Phenotype Microarray Correction',
                'value': 'pmonly',
                'label': 'PM Only'
            })
        else:
            stageprppmc    = stageprppmc[0]
        stageprppmc.status = Pipeline.READY
        config.preprocess.phenotype_microarray_correction \
        = stageprppmc.value
        objekt.add_stages(stageprppmc)

        # Summarization
        stageprpsum  = [stage for stage in stages if stage.code.startswith('prp.sum')]
        if len(stageprpsum)  > 1:
            raise ValueError('More than one Summarization method provided.')
        if len(stageprpsum) == 0:
            stageprpsum     = addict.Dict({
                   'ID': get_rand_uuid_str(),
                 'code': 'prp.sum',
                 'name': 'Summarization',
                'value': 'medianpolish',
                'label': 'Median Polish'
            })
        else:
            stageprpsum    = stageprpsum[0]
        stageprpsum.status = Pipeline.READY
        config.preprocess.summary \
        = stageprpsum.value
        objekt.add_stages(stageprpsum)

        # k-Fold Cross Validation
        stageprpkcv  = [stage for stage in stages if stage.code.startswith('prp.kcv')]
        if len(stageprpkcv)  > 1:
            raise ValueError('More than one fold value provided.')
        if len(stageprpkcv) == 0:
            stageprpkcv     = addict.Dict({
                   'ID': get_rand_uuid_str(),
                 'code': 'prp.kcv',
                 'name': 'k-Fold Cross Validation',
                'value': 2,
                'label': 2
            })
        else:
            stageprpkcv    = stageprpkcv[0]
        stageprpkcv.status = Pipeline.READY
        config.preprocess.folds \
        = int(stageprpkcv.value)
        objekt.add_stages(stageprpkcv)

        # Feature Selection
        stageats     = [stage for stage in stages if stage.code.startswith('ats')]
        config.feature_selection \
        = [stage.value for stage in stageats]
        objekt.add_stages(*stageats)

        stagelrn     = [stage for stage in stages if stage.code.startswith('lrn')]
        config.model \
        = [stage.value for stage in stagelrn]
        objekt.add_stages(*stagelrn)

        objekt.set_config(config)

        return data, objekt, fpath

    def runner(self, cdat, heap_size = 16384, seed = None, verbose = True, split_percent = 30):
        self.set_status(Pipeline.RUNNING)

        self.logs.append('Initializing Pipeline')

        para = self.config

        self.logs.append('Reading Pipeline Configuration')

        head = ''
        name = get_rand_uuid_str()

        self.logs.append('Reading Input File')

        for i, stage in enumerate(self.stages):
            if stage.code in ('dat.fle', 'prp.bgc', 'prp.nrm', 'prp.pmc', 'prp.sum'):
                self.stages[i].status = Pipeline.RUNNING
            if stage.code ==  'dat.fle':
                head    = os.path.abspath(stage.value.path)
                name, _ = os.path.splitext(stage.value.name)

        self.logs.append('Parsing to ARFF')

        path = os.path.join(head, '{name}.arff'.format(name = name))
        # This bug, I don't know why, using Config.schema instead.
        # cdat.toARFF(path, express_config = para.Preprocess.schema, verbose = verbose)

        for i, stage in enumerate(self.stages):
            if stage.code in ('dat.fle', 'prp.bgc', 'prp.nrm', 'prp.pmc', 'prp.sum'):
                self.stages[i].status = Pipeline.COMPLETE

        self.logs.append('Saved ARFF at {path}'.format(path = path))

        JVM.start(max_heap_size = '{size}m'.format(size = heap_size))

        load = Loader(classname = 'weka.core.converters.ArffLoader')
        # data = load.load_file(path)
        # save =  Saver(classname = 'weka.core.converters.ArffSaver')
        path = 'diabetes.arff' # For debugging Purposes Only
        data = load.load_file(os.path.join(head, path)) # For Debugging Purposes Only
        data.class_is_last() # For Debugging Purposes Only
        # data.class_index = cdat.iclss
                
        self.logs.append('Splitting to Training and Testing datasets with randomized data - Ratio of train:test split is {}:{}'.format(split_percent, 100 - split_percent))
        wobj = Filter(classname = 'weka.filters.unsupervised.instance.Randomize')
        wobj.inputformat(data)
        data = wobj.filter(data)

        opts = ['-P', str(split_percent)]
        wobj = Filter(classname = 'weka.filters.unsupervised.instance.RemovePercentage', options = opts + ['-V'])
        wobj.inputformat(data)
        
        test = wobj.filter(data)
        wobj.options = opts
        tran = wobj.filter(data)


        saver =  Saver(classname = 'weka.core.converters.ArffSaver')
        
        train_path = os.path.join(head, modify_train_path(path))
        test_path = os.path.join(head, modify_test_path(path))
        saver.save_file(tran, train_path)
        saver.save_file(test, test_path)
        
        data = tran

        for i, stage in enumerate(self.stages):
            if stage.code == 'prp.kcv':
                self.stages[i].status = Pipeline.RUNNING

        self.logs.append('Splitting to Training and Testing Sets')
        # TODO - Check if this seed is worth it.
        seed = assign_if_none(seed, random.randint(0, 1000))
        opts = ['-S', str(seed), '-N', str(para.Preprocess.FOLDS)]
        wobj = Filter(classname = 'weka.filters.supervised.instance.StratifiedRemoveFolds', options = opts + ['-V'])
        wobj.inputformat(data)
        
        tran = wobj.filter(data)

        self.logs.append('Splitting Testing Set')
        wobj.options = opts
        test = wobj.filter(data)

        for i, stage in enumerate(self.stages):
            if stage.code == 'prp.kcv':
                self.stages[i].status = Pipeline.COMPLETE

        self.logs.append('Performing Feature Selection')

        feat = [ ]
        for comb in para.FEATURE_SELECTION:
            if comb.USE:
                for i, stage in enumerate(self.stages):
                    if stage.code == 'ats':
                        search    = stage.value.search.name
                        evaluator = stage.value.evaluator.name

                        if search == comb.Search.NAME and evaluator == comb.Evaluator.NAME:
                            self.stages[i].status = Pipeline.RUNNING

                srch = ASSearch(classname = 'weka.attributeSelection.{classname}'.format(
                    classname = comb.Search.NAME,
                    options   = assign_if_none(comb.Search.OPTIONS, [ ])
                ))
                ewal = ASEvaluation(classname = 'weka.attributeSelection.{classname}'.format(
                    classname = comb.Evaluator.NAME,
                    options   = assign_if_none(comb.Evaluator.OPTIONS, [ ])
                ))

                attr = AttributeSelection()
                attr.search(srch)
                attr.evaluator(ewal)
                attr.select_attributes(tran)

                meta = addict.Dict()
                meta.search    = comb.Search.NAME
                meta.evaluator = comb.Evaluator.NAME
                meta.features  = [tran.attribute(index).name for index in attr.selected_attributes]

                feat.append(meta)

                for i, stage in enumerate(self.stages):
                    if stage.code == 'ats':
                        search    = stage.value.search.name
                        evaluator = stage.value.evaluator.name

                        if search == comb.Search.NAME and evaluator == comb.Evaluator.NAME:
                            self.stages[i].status = Pipeline.COMPLETE

        models = [ ]
        for model in para.MODEL:
            if model.USE:
                summary         = addict.Dict()

                self.logs.append('Modelling {model}'.format(model = model.LABEL))

                summary.label   = model.LABEL
                summary.name    = model.NAME
                summary.options = assign_if_none(model.OPTIONS, [ ])

                for i, stage in enumerate(self.stages):
                    if stage.code == 'lrn' and stage.value.name == model.NAME:
                        self.stages[i].status = Pipeline.RUNNING

                for i, instance in enumerate(data):
                    iclass = list(range(instance.num_classes))

                options    = assign_if_none(model.OPTIONS, [ ])
                classifier = Classifier(classname = 'weka.classifiers.{classname}'.format(classname = model.NAME), options = options)
                classifier.build_classifier(tran)

                serializer.write(os.path.join(head, '{name}.{classname}.model'.format(
                        name = name,
                    classname = model.NAME
                )), classifier)

                self.logs.append('Testing model {model}'.format(model = model.LABEL))

                evaluation       = Evaluation(tran)
                evaluation.test_model(classifier, test)

                summary.summary  = evaluation.summary()

                frame  = pd.DataFrame(data = evaluation.confusion_matrix)
                axes   = sns.heatmap(frame, cbar = False, annot = True)
                b64str = get_b64_plot(axes)

                summary.confusion_matrix = addict.Dict({
                    'value': evaluation.confusion_matrix.tolist(),
                     'plot': b64str
                })

                self.logs.append('Plotting Learning Curve for {model}'.format(model = model.LABEL))

                buffer = io.BytesIO()
                plot_classifier_errors(evaluation.predictions, tran, test, outfile = buffer, wait = False)
                b64str = buffer_to_b64(buffer)

                summary.learning_curve   = b64str

                buffer = io.BytesIO()
                plot_roc(evaluation, class_index = iclass, outfile = buffer, wait = False)
                b64str = buffer_to_b64(buffer)

                summary.roc_curve        = b64str

                buffer = io.BytesIO()
                plot_prc(evaluation, class_index = iclass, outfile = buffer, wait = False)
                b64str = buffer_to_b64(buffer)

                summary.prc_curve        = b64str

                if classifier.graph:
                    summary.graph = classifier.graph

                for i, instance in enumerate(test):
                    prediction = classifier.classify_instance(instance)

                for i, stage in enumerate(self.stages):
                    if stage.code == 'lrn' and stage.value.name == model.NAME:
                        self.stages[i].status = Pipeline.COMPLETE

                models.append(summary)

        self.gist.models = models
        self.gist.name = '{}.cgist'.format(name)

        JVM.stop()

        JSON.write(os.path.join(head, '{name}.cgist'.format(name = name)), self.gist)

        self.logs.append('Pipeline Complete')

        self.set_status(Pipeline.COMPLETE)

    def run(self, cdat, heap_size = 16384, seed = None, verbose = False, split_percent = 30):
        if not self.thread:
            self.thread = threading.Thread(target = self.runner, args = (cdat, heap_size, seed, verbose, split_percent))
            self.thread.start()
        else:
            warnings.warn('Pipeline currently active.')

    def generate_predictions(self, test_path, model_path, heap_size = 16384, seed = None, verbose = True):
        # assumes the class index is last for the given testing dataset.

        JVM.start(max_heap_size = '{size}m'.format(size = heap_size))

        load = Loader(classname = 'weka.core.converters.ArffLoader')
        test_data = load.load_file(test_path)
        test_data.class_is_last()

        fileClassifier = Classifier(jobject = serializer.read(model_path))

        # output predictions
        print("# - actual - predicted - error - distribution")
        for index, inst in enumerate(test_data):
            pred = fileClassifier.classify_instance(inst)
            dist = fileClassifier.distribution_for_instance(inst)
            print(
                "%d - %s - %s - %s  - %s" %
                (index+1,
                inst.get_string_value(inst.class_index),
                inst.class_attribute.value(int(pred)),
                "yes" if pred != inst.get_value(inst.class_index) else "no",
                str(dist.tolist())))

        JVM.stop()

    def predict(self, test_path, model_path, heap_size = 16384, seed = None, verbose = False):
        if not self.thread:
            self.thread = threading.Thread(target = self.generate_predictions, args = (test_path, model_path, heap_size, seed, verbose))
            self.thread.start()
        else:
            warning.warn('Pipeline currently active')
