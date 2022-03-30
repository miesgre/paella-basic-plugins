import {
    createElementWithHtmlText,
    PopUpButtonPlugin,
    translate
} from 'paella-core';

import '../css/DownloadsPlugin.css';

import DownloadIcon from '../icons/download.svg';

export default class DownloadsPlugin extends PopUpButtonPlugin {
    async load() {
        this.icon = DownloadIcon;

        const { streams } = this.player.videoManifest;
        this._downloads = {};

        streams.forEach(s => {
            let streamDownloads = [];
            const { mp4 } = s.sources;
            if (mp4) {
                mp4.forEach(v => {
                    streamDownloads.push({
                        id: `${s.content}_${v.res.w}_${v.res.h}`,
                        src: v.src,
                        res: v.res,
                        mimetype: v.mimetype
                    });
                });
            }
            if (streamDownloads.length > 0) {
                this._downloads[s.content] = streamDownloads;
            }
        });
    }

    async getContent() {
        const container = createElementWithHtmlText(`
          <div class="downloads-plugin">
              <h4>${translate('Available downloads')}</h4>
          </div>`);
        const downloadKeys = Object.keys(this._downloads);
        downloadKeys.forEach(k => {
            const J = createElementWithHtmlText(`
          <div class="downloadStream">
            <div class="title">${k}</div>
          </div>`, container);
            const list = createElementWithHtmlText('<ul></ul>', J);
            const streamDownloads = this._downloads[k];
            streamDownloads.forEach(d => {
                const res = `${d.res.w}x${d.res.h}`;
                createElementWithHtmlText(`
                  <li>
                    <a href="${d.src}" target="_blank">
                      <span class="mimetype">[${d.mimetype}]</span><span class="res">${res}</span>
                    </a>
                  </li>
              `, list);
            });
        });
        return container;
    }
}