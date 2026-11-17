import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'../../..');
const materials=path.join(repo,'materials');
const require=createRequire(import.meta.url);
const artifactRequire=createRequire(require.resolve('@oai/artifact-tool'));
const {FontLibrary}=artifactRequire('skia-canvas');
const fonts=path.join(materials,'working-with-claude/.build/fonts');
FontLibrary.use('IBM Plex Serif',[path.join(fonts,'PlexSerif-Regular.ttf'),path.join(fonts,'PlexSerif-Italic.ttf')]);
FontLibrary.use('IBM Plex Serif Medium',[path.join(fonts,'PlexSerif-Medium.ttf')]);
FontLibrary.use('IBM Plex Mono',[path.join(fonts,'PlexMono-Regular.ttf')]);
const slugs=process.argv.slice(2);
if(!slugs.length)throw new Error('Supply one or more deck slugs');
for(const slug of slugs){
 const dir=path.join(materials,slug);
 const proto=JSON.parse(await fs.readFile(path.join(dir,'.build',slug==='working-with-claude'?'deck.json':'publish-deck.json'),'utf8'));
 // The approved decks each use this same local cover image. Cloud snapshots keep
 // its library URI rather than bytes, so embed the original artwork for offline use.
 if(proto.images.length!==1)throw new Error('Review image inventory before export: '+slug);
 const cover=new Uint8Array(await fs.readFile(path.join(repo,'assets/images/advisory-worktable.png')));
 proto.images[0].data=cover;delete proto.images[0].uri;
 const P=await Presentation.load(proto);
 const notes=Object.fromEntries((await fs.readFile(path.join(dir,'source/notes.md'),'utf8')).split(/^## /m).slice(1).map(a=>{const i=a.indexOf('\n');return[a.slice(0,i),a.slice(i+1).trim()];}));
 const resource='https://advisory.andrewphunter.com/resources/'+slug+'/';
 const label=resource.replace('https://','');
 const notesAudit=[];
 for(const s of P.slides.items){
  const title=s.shapes.items.find(a=>a.name==='title')?.text.toString()??(s===P.slides.items[0]?Object.keys(notes)[0]:undefined);
  if(!notes[title])throw new Error('No approved notes for '+title);
  const old=s.speakerNotes.text;
  if(old.split('\n\nReferences\n')[0].trim()!==notes[title])throw new Error('Notes differ from approved source: '+title);
  s.speakerNotes.setVisible(true);
  notesAudit.push({title,characters:notes[title].length});
  const f=s.shapes.items.find(a=>a.name==='footer');
  if(f){f.text=label;f.text.get(label).link={uri:resource,isExternal:true};}
  // Older live snapshots omit the hyperlink color-source flag. Reapply each
  // link's intended text color through the current API before file export.
  const dark=JSON.stringify(proto.slides[P.slides.items.indexOf(s)].background).toLowerCase().includes('0e1524');
  for(const a of s.shapes.items){
   if(a.name==='footer')a.text.get(a.text.toString()).color=dark?'#d5d9df':'#505b69';
   else if(['advisory','docs','anthropic-docs','essay','essay-link','advisory-link','contact','article-link'].includes(a.name)){
    a.text.get(a.text.toString()).color=a.name==='advisory'?'#fafaf5':dark?'#d4ad5a':'#856427';
   }
  }
 }
 const out=path.join(dir,'output');await fs.mkdir(out,{recursive:true});
 await (await PresentationFile.exportPptx(P)).save(path.join(out,slug+'-v1.pptx'));
 console.log(slug+': PowerPoint exported, '+notesAudit.length+' slides with notes');
 const fontConfig=path.join(dir,'.build/publish-fonts.conf');
 await fs.writeFile(fontConfig,'<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>'+fonts+'</dir><dir>/System/Library/Fonts</dir><cachedir>'+path.join(dir,'.build/font-cache')+'</cachedir></fontconfig>');
 execFileSync('/Users/andyhunter/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/soffice',['--headless','--convert-to','pdf','--outdir',out,path.join(out,slug+'-v1.pptx')],{env:{...process.env,FONTCONFIG_FILE:fontConfig,SAL_FONTPATH:fonts},stdio:'inherit'});
 await fs.writeFile(path.join(dir,'.build/export-notes-audit.json'),JSON.stringify(notesAudit,null,2));
 console.log(slug+': PDF exported');
}
