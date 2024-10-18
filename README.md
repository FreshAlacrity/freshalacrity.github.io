# FreshAlacrity Pages

Tinkering and small javascript projects - a few small toys/proof of concept things and some projects that end up getting their own repositories over time.

## Adding New Submodules to GitHub Pages Sites
Both for my own reference and in case it helps others. :)<br>
If the folder had already been part of the repository, delete it and do this from Git Bash in the folder that the submodule folder should be added to:
(GitHub Desktop will still error afterwards if the folder is still open in VS Code or File Explorer etc, so close those before pushing.)
```
git rm -r --cached submodule_dir
git submodule add https://github.com/FreshAlacrity/timer submodule_dir
```

## Updating Submodules
via https://stackoverflow.com/a/5828396 with some updates and annotation
```
# Change to the submodule directory
cd submodule_dir

# Checkout desired branch (not neccessary if it's already on the desired branch)
git checkout main

# Update
git pull

# Get back to your project root
cd ..

# Now the submodules are in the state you want, so
git commit -am "Pulled down update to submodule_dir"

Or, if you're a busy person:
git submodule foreach git pull origin main
```
