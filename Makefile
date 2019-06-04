# -include .env

# .PHONY: build
# .PHONY: docs

# BASEDIR      = $(realpath .)
# MODULE       = candis
# HONCHO_MANAGER = honcho_manager.py 

# SOURCEDIR    = $(realpath $(MODULE))
# DOCSDIR      = $(realpath docs)
# VIRTUALENV   = $(VIRTUAL_ENV)

# # PIPENV      ?= pipenv
# # PYBINARIES   = $(shell pipenv --venv)/bin
# # PYTHON      ?= $(PYBINARIES)/python
# # PIP         ?= $(PYBINARIES)/pip

# PYBINARIES   = $(VIRTUALENV)/bin
# PYTHON       = $(PYBINARIES)/python
# PIP          = $(PYBINARIES)/pip
# IPYTHON      = $(PYBINARIES)/ipython
# HONCHO       = $(PYBINARIES)/honcho
# PYTEST       = $(PYBINARIES)/pytest
# TWINE        = $(PYBINARIES)/twine

# NODE_MODULES = $(BASEDIR)/node_modules
# NODEBINARIES = $(NODE_MODULES)/.bin

# YARN        ?= yarn

# clean.py:
# 	$(PYTHON) setup.py clean

# clean:
# 	make clean.py
	
# 	rm -rf .sass-cache

# 	clear
	
# clean.force:
# 	rm -rf $(BASEDIR)/node_modules
# 	rm -rf $(DOCSDIR)/build

# 	make clean
	
# install:
# 	# $(PIPENV)  install --skip-lock # skip-lock flag need to be removed after pipenv update.
# 	$(PIP) install --ignore-installed -r $(BASEDIR)/requirements.txt
# 	$(YARN)    install

# 	$(PYTHON) setup.py develop

# 	make clean

# lock:
# 	# Lock Dependencies

# 	# rm -rf $(BASEDIR)/Pipfile.lock
# 	rm -rf $(BASEDIR)/requirements.txt
# 	rm -rf $(BASEDIR)/requirements-dev.txt
	
# 	# Temporary not doing this for now.
# 	# see - https://github.com/pypa/pipenv/issues/357
# 	# $(PIPENV) lock --requirements       > $(BASEDIR)/requirements.txt
# 	# $(PIPENV) lock --requirements --dev > $(BASEDIR)/requirements-dev.txt

# 	$(PIP) freeze > $(BASEDIR)/requirements.txt

# upgrade:
# 	$(YARN) upgrade

# test:
# 	make install
# 	# $(PIPENV) shell # to activate the virtualenv of pipenv.
# 	$(PYTEST) --cov=candis.app.server.api candis/app/server/api/tests
# 	$(YARN) test

# 	make clean.py

# build:
# 	$(PYTHON) -B -m builder

# 	$(YARN) run build

# 	make clean

# docs:
# 	cd $(DOCSDIR) && make html

# sass:
# 	$(YARN) run sass

# sass.watch:
# 	$(YARN) run sass.watch

# docker.build:
# 	docker build -t $(MODULE) $(BASEDIR)

# console:
# 	$(IPYTHON) 

# start:
# ifeq ($(ENV), development)
# 	$(PYTHON) $(BASEDIR)/$(HONCHO_MANAGER) --env 'dev'
# else
# 	$(PYTHON) $(BASEDIR)/$(HONCHO_MANAGER) --env 'prod'
# endif

# release:
# ifeq ($(ENV), production)
# 	make clean
	
# 	$(PYTHON) setup.py sdist bdist_wheel

# 	$(TWINE) upload -r candis $(BASEDIR)/dist/*

# 	make clean
# else
# 	@echo "Unable to release. Make sure the environment is in production mode."
# endif

.PHONY: docs test shell help

BASEDIR					= $(shell pwd)
-include ${BASEDIR}/.env

ENVIRONMENT			   ?= development

PROJECT					= candis

PROJDIR					= ${BASEDIR}/candis
DOCSDIR					= ${BASEDIR}/docs

PYTHONPATH		 	   ?= $(shell command -v python)
VIRTUALENV			   ?= $(shell command -v virtualenv)

VENVDIR				   ?= ${BASEDIR}/.venv
VENVBIN					= ${VENVDIR}/bin

PYTHON				  	= ${VENVBIN}/python
IPYTHON					= ${VENVBIN}/ipython
PIP					  	= ${VENVBIN}/pip
PYTEST					= ${VENVBIN}/pytest
DETOX				  	= ${VENVBIN}/detox
COVERALLS				= ${VENVBIN}/coveralls
TWINE					= ${VENVBIN}/twine
SPHINXBUILD				= ${VENVBIN}/sphinx-build
IPYTHON					= ${VENVBIN}/ipython
BUMPVERSION				= ${VENVBIN}/bumpversion

JOBS				   ?= $(shell $(PYTHON) -c "import multiprocessing as mp; print(mp.cpu_count())")
PYTHON_ENVIRONMENT      = $(shell $(PYTHON) -c "import sys;v=sys.version_info;print('py%s%s'%(v.major,v.minor))")

NULL					= /dev/null

define log
	$(eval CLEAR     = \033[0m)
	$(eval BOLD		 = \033[0;1m)
	$(eval INFO	     = \033[0;36m)
	$(eval SUCCESS   = \033[0;32m)

	$(eval BULLET 	 = "→")
	$(eval TIMESTAMP = $(shell date +%H:%M:%S))

	@echo "${BULLET} ${$1}[${TIMESTAMP}]${CLEAR} ${BOLD}$2${CLEAR}"
endef

define browse
	$(PYTHON) -c "import webbrowser as wb; wb.open('${$1}')"
endef

ifndef VERBOSE
.SILENT:
endif

.DEFAULT_GOAL 		   := help

env: ## Create a Virtual Environment
ifneq (${VERBOSE},true)
	$(eval OUT = > /dev/null)
endif

	$(call log,INFO,Creating a Virtual Environment ${VENVDIR} with Python - ${PYTHONPATH})
	$(VIRTUALENV) $(VENVDIR) -p $(PYTHONPATH) $(OUT)

info: ## Display Information
	@echo "Python Environment: ${PYTHON_ENVIRONMENT}"

requirements: ## Make requirements
	$(call log,INFO,Building Requirements)
	@awk '{print}' $(BASEDIR)/requirements/*.txt > $(BASEDIR)/requirements-dev.txt
	@cat $(BASEDIR)/requirements/production.txt  > $(BASEDIR)/requirements.txt

install: clean requirements ## Install dependencies and module.
ifneq (${VERBOSE},true)
	$(eval OUT = > /dev/null)
endif

ifneq (${PIPCACHEDIR},)
	$(eval PIPCACHEDIR = --cache-dir $(PIPCACHEDIR))
endif

	$(call log,INFO,Installing Requirements)
	$(PIP) install -qr $(BASEDIR)/requirements-dev.txt

	$(call log,INFO,Installing ${PROJECT} (${ENVIRONMENT}))
ifeq (${ENVIRONMENT},production)
	$(PYTHON) setup.py install $(OUT)
else
	$(PYTHON) setup.py develop $(OUT)
endif

	$(call log,SUCCESS,Installation Successful)

clean: ## Clean cache, build and other auto-generated files.
	@clear

	$(call log,INFO,Cleaning Python Cache)
	@find $(BASEDIR) | grep -E "__pycache__|\.pyc" | xargs rm -rf

	@rm -rf \
		$(BASEDIR)/*.egg-info \
		$(BASEDIR)/.pytest_cache \
		$(BASEDIR)/.tox \
		$(BASEDIR)/.coverage* \
		$(BASEDIR)/htmlcov \
		$(BASEDIR)/dist \
		$(BASEDIR)/build \

	$(call log,SUCCESS,Cleaning Successful)

test: install ## Run tests.
	$(call log,INFO,Running Python Tests using $(JOBS) jobs.)
	$(DETOX) -n $(JOBS) --skip-missing-interpreters $(ARGS)

coverage: install ## Run tests and display coverage.
ifeq (${ENVIRONMENT},development)
	$(eval IARGS := --cov-report html)
endif

	$(PYTEST) -n $(JOBS) --cov $(PROJDIR) $(IARGS) -vv $(ARGS)

ifeq (${ENVIRONMENT},development)
	$(call browse,file:///${BASEDIR}/htmlcov/index.html)
endif

ifeq (${ENVIRONMENT},test)
	$(COVERALLS)
endif

docs: install ## Build Documentation
ifneq (${VERBOSE},true)
	$(eval OUT = > /dev/null)
endif

	$(call log,INFO,Building Documentation)
	$(SPHINXBUILD) $(DOCSDIR)/source $(DOCSDIR)/build $(OUT)

	$(call log,SUCCESS,Building Documentation Successful)

ifeq (${launch},true)
	$(call browse,file:///${DOCSDIR}/build/index.html)
endif

bump: test ## Bump Version
	$(BUMPVERSION) \
		--current-version $(shell cat $(PROJDIR)/VERSION) \
		$(TYPE) \
		$(PROJDIR)/VERSION 

release: test ## Create a Release
	$(PYTHON) setup.py sdist bdist_wheel

ifeq (${ENVIRONMENT},development)
	$(call log,WARN,Ensure your environment is in production mode.)
	$(TWINE) upload --repository-url https://test.pypi.org/legacy/   $(BASEDIR)/dist/* 
else
	$(TWINE) upload --repository-url https://upload.pypi.org/legacy/ $(BASEDIR)/dist/* 
endif

shell: ## Launch an IPython shell.
	$(call log,INFO,Launching Python Shell)
	$(IPYTHON) \
		--no-banner

help: ## Show help and exit.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)