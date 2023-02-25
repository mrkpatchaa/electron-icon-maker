## electron-icon-maker for Forge

#### Global usage

Install globally using

```
npm install -g @mrkpatchaa/electron-icon-maker-forge
```

To use

```
electron-icon-maker-forge --input=/absolute/path/file.png --output=./relative/path/to/folder --name=desired-output-icon-name
```

#### Local usage

Install locally
```
npm install --save-dev @mrkpatchaa/electron-icon-maker-forge
```

To use
```
./node_modules/.bin/electron-icon-maker-forge --input=/absolute/path/file.png --output=./relative/path/to/folder --name=desired-output-icon-name
```

#### Arguments

```
--output, -o = [String] Folder to create files
--input, -i = [String] Path to PNG file
--name, -n = [String] Desired output file names
```

#### Recommendations
Input file should be 1024px x 1024px or larger. Make sure it is a 1 to 1 aspect ratio on width to height.

#### Output structure
```
[output dir]
    - [name].icns
    - [name].ico
    - [name].png
    - [name]@2x.png
```