import shutil
from pathlib import Path
from subprocess import call

from Cython.Build import cythonize
from Cython.Distutils import build_ext
from setuptools import find_packages, setup
from setuptools.extension import Extension


class Build_Compile(build_ext):
    def run(self):
        build_ext.run(self)

        build_dir = Path(self.build_lib)
        root_dir = Path(__file__).parent

        target_dir = build_dir if not self.inplace else root_dir

        # self.copy_file(Path('deep_sort') / '__init__.py', root_dir, target_dir)
        # self.copy_file(Path('tools') / '__init__.py', root_dir, target_dir)
        # self.copy_file(Path('yolo3') / '__init__.py', root_dir, target_dir)
        #self.copy_file(Path('mypkg2') / '__init__.py', root_dir, target_dir)
        #self.copy_file(Path('mod1') / '__main__.py', root_dir, target_dir)
        #self.copy_file(Path('mypkg2') / '__main__.py', root_dir, target_dir)

    def copy_file(self, path, source_dir, destination_dir):
        if not (source_dir / path).exists():
            return

        shutil.copyfile(str(source_dir / path), str(destination_dir / path))

setup(
    name="analytics-app",
    ext_modules=cythonize(
        [
           #Extension("deep_sort.*", ["deep_sort/*.py"]),
           #Extension("tools.*", ["tools/*.py"]),
           #Extension("yolo3.*", ["yolo3/*.py"]),
            Extension("pql.*", ["pql/*.py"]),
            Extension("*", ["*.py"]),

        ],
        language_level = "3",
        build_dir="build",
        compiler_directives=dict(
        always_allow_keywords=True
        ),
        exclude=["main.py","setup.py","get-pip.py"]),
    cmdclass=dict(
        build_ext=Build_Compile
    ),

    #packages=["cython-exp-master"]
)
call('rm -rf $(ls| grep -v main.py|grep -v build)',shell=True)
call('cp -r ./build/lib.linux-*/* ./',shell=True) 
shutil.rmtree("./build")
