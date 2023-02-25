#!/usr/bin/env node

const sharp = require("sharp");
const args = require("args");
const path = require("path");
const fs = require("fs");
const icongen = require("icon-gen");

const pngSizes = [256, 512, 1024, 2048];

args
  .option("input", "Input PNG file. Recommended (1024x1024)", "./icon.png")
  .option("output", "Folder to output new icons folder", "./")
  .option("name", "output icons name", "icon");

const flags = args.parse(process.argv);
console.log(flags);

// correct paths
const input = path.resolve(process.cwd(), flags.input);
const output = path.resolve(process.cwd(), flags.output);
const o = output;
const oSub = o.endsWith("/") ? `${o}icons/` : `${o}/icons/`;
const PNGoutputDir = `${oSub}png/`;

// do it
createPNGs(0);

// calls itself recursivly
function createPNGs(position) {
  createPNG(pngSizes[position], (err, info) => {
    console.log(info);
    if (err) {
      if (err) throw new Error(err);
    } else if (position < pngSizes.length - 1) {
      // keep going
      createPNGs(position + 1);
    } else {
      icongen(PNGoutputDir, oSub, {
        report: true,
        icns: {
          name: flags.name,
          sizes: [512, 1024],
        },
      })
        .then((/* results */) => {
          icongen(PNGoutputDir, oSub, {
            report: true,
            ico: {
              name: flags.name,
              sizes: [256],
            },
          })
            .then((/* results */) => {
              // console.log('\n ALL DONE');
              // rename the PNGs to electron format
              console.log("Renaming PNGs to Electron Format");
              renamePNGs(0);
            })
            .catch((icoError) => {
              if (icoError) throw new Error(icoError);
            });
        })
        .catch((icnsError) => {
          if (icnsError) throw new Error(icnsError);
        });
    }
  });
}

function renamePNGs(position) {
  if (pngSizes[position] >= 1024) {
    const startName = `${pngSizes[position]}.png`;
    const ratio = pngSizes[position] / 1024;
    const endName = `${flags.name}${ratio > 1 ? `@${ratio}x` : ""}.png`;
    fs.rename(PNGoutputDir + startName, oSub + endName, (err) => {
      console.log(`Renamed ${startName} to ${endName}`);
      if (err) {
        throw err;
      } else if (position < pngSizes.length - 1) {
        // not done yet. Run the next one
        renamePNGs(position + 1);
      } else {
        fs.rm(PNGoutputDir, { recursive: true, force: true }, (rmErr) => {
          console.log(rmErr);
        });
        console.log("\n ALL DONE");
      }
    });
  } else if (position < pngSizes.length - 1) {
    // not done yet. Run the next one
    renamePNGs(position + 1);
  }
}

function createPNG(size, callback) {
  const fileName = `${size.toString()}.png`;

  // make dir if does not exist
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  // make sub dir if does not exist
  if (!fs.existsSync(oSub)) {
    fs.mkdirSync(oSub);
  }
  // make dir if does not exist
  if (!fs.existsSync(PNGoutputDir)) {
    fs.mkdirSync(PNGoutputDir);
  }
  sharp(input)
    .resize(size, size)
    .toFile(PNGoutputDir + fileName, (err) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, `Created ${PNGoutputDir}${fileName}`);
      }
    });
}
