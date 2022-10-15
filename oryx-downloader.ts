
import axios from 'axios'
import unzipper from 'unzipper'
import { createWriteStream, mkdir } from "fs";
import Path from 'path';

const ORYX_GRAPHQL_URL = 'https://oryx.zsa.io/graphql'

export async function getKeymapSourceLink(hashId, revisionId = 'latest') {
  const query = `
query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
  Layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
    revision {
      zipUrl
    }
  }
}`
  const { data } = await axios.post(ORYX_GRAPHQL_URL, {
    operationName: 'getLayout',
    variables: {
        hashId,
        geometry: 'moonlander',
        revisionId,
    },
    query,
  })
  return data.data.Layout.revision.zipUrl
}

export async function unzipKeymapSource(url, path) {
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream'
  })

  return response.data.pipe(unzipper.Parse()).on('entry', function (entry) {
    const fileName = Path.basename(entry.path);
    if(["keymap.c", "config.h", "rules.mk"].indexOf(fileName) +1){
      entry.pipe(createWriteStream(path + '/' + fileName));
      console.log("extracted ", fileName);
    } else {
      entry.autodrain();
    }
  }).promise()
}


export async function downloadKeymapSource(layoutHashId, path) {
  const zipUrl = await getKeymapSourceLink(layoutHashId)
  mkdir(Path.resolve(__dirname, path), { recursive: true }, (err) => {
    if (err) throw err;
  });
  await unzipKeymapSource(zipUrl, path)
  console.log('Downloaded layout', layoutHashId, 'from', zipUrl)
}

if (typeof require !== 'undefined' && require.main === module) {
  const hashId = process.argv[2] || process.env.LAYOUT_ID || 'PqjlE'
  downloadKeymapSource(hashId, process.env.LAYOUT_DIR || './layout_src')
}
