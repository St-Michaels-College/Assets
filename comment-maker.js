var FREQ_A = ["Daily","2-3 times per week","Weekly","Fortnightly","Monthly","2 times per term","Once a term","Once a semester"];
var FREQ_B = ["Every assessment","Every 2-3 assessments","Once a term","Once a semester"];

var CATEGORIES = [
  {
    key:"tl", heading:"Teaching/learning adjustments", freq:FREQ_A,
    items:[
      "Provision of individualised checklist",
      "Use of additional concrete materials",
      "Check-ins with student immediately after whole class instruction",
      "Ongoing regular check-ins during the lesson",
      "Increased verbal and/or non-verbal prompts to support student to stay on task",
      "Additional wait time for answers",
      "Additional time for task completion",
      "Provision of adjusted worksheets",
      "Use of graphic organisers and/or scaffolding sheets",
      "Access to digital versions of materials",
      "Numeracy supports e.g. calculator, times table chart",
      "Student choice in representing their learning",
      "Access to Text-to-Speech and/or Speech-to-Text tools"
    ]
  },
  {
    key:"a", heading:"Assessment adjustments", freq:FREQ_B,
    items:[
      "Adjusted workload expectation",
      "Preferred alternative assessments to demonstrate learning",
      "Individualised assessment task design",
      "Provide extra time in tests/exams",
      "Provide timed rest breaks in tests/exams",
      "Provide a reader and/or scribe for tests/exams",
      "Provide separate supervision to complete tests/exams"
    ]
  },
  {
    key:"e", heading:"Environment adjustments", freq:FREQ_A,
    items:[
      "Preferential seating plan",
      "Personalised desk",
      "Personalised seating",
      "Access to specific learning space/activities within the classroom"
    ]
  },
  {
    key:"p", heading:"Pastoral adjustments", freq:FREQ_A,
    items:[
      "Provision of individualised visual schedule",
      "Provision of organisation assistance",
      "Additional movement/sensory breaks",
      "Increased use of headphones to support self-regulation",
      "Provision of specific sensory tools",
      "Explicit personalised support to introduce and communicate changes in routine",
      "Active use of co-regulation strategies",
      "Targeted and individual prompting to support behavioural expectations",
      "Individual behaviour monitoring cards and/or check-ins",
      "Individualised goals, reward systems and reminders"
    ]
  }
];

function findCategory(key){
  for(var c=0;c<CATEGORIES.length;c++){
    if(CATEGORIES[c].key === key) return CATEGORIES[c];
  }
  return null;
}

function renderCategories(){
  var root = document.getElementById('categories');
  var html = "";
  for(var c=0;c<CATEGORIES.length;c++){
    var cat = CATEGORIES[c];
    html += '<div class="category">';
    html += '<div class="category-head"><h2>' + cat.heading + '</h2>';
    html += '<button type="button" class="clear-section" data-cat="' + cat.key + '">Clear section</button></div>';

    for(var i=0;i<cat.items.length;i++){
      var label = cat.items[i];
      var id = cat.key + '_' + i;
      html += '<div class="item">';
      html += '<input type="checkbox" class="adj-check" id="chk_' + id + '" data-item="' + id + '">';
      html += '<label for="chk_' + id + '">' + label + '</label>';
      html += '<select id="freq_' + id + '" disabled><option value="">Frequency...</option>';
      for(var f=0;f<cat.freq.length;f++){
        html += '<option value="' + cat.freq[f] + '">' + cat.freq[f] + '</option>';
      }
      html += '</select></div>';
    }
    html += '</div>';
  }
  root.innerHTML = html;
}

function toggleFreq(id){
  var chk = document.getElementById('chk_' + id);
  var sel = document.getElementById('freq_' + id);
  sel.disabled = !chk.checked;
  if(!chk.checked) sel.value = "";
}

function clearCategory(key){
  var cat = findCategory(key);
  for(var i=0;i<cat.items.length;i++){
    var id = key + '_' + i;
    document.getElementById('chk_' + id).checked = false;
    var sel = document.getElementById('freq_' + id);
    sel.value = "";
    sel.disabled = true;
  }
}

function resetAll(){
  document.getElementById('studentName').value = "";
  document.getElementById('className').value = "";
  for(var c=0;c<CATEGORIES.length;c++){
    clearCategory(CATEGORIES[c].key);
  }
  document.getElementById('output').innerHTML = '<span class="placeholder">Your comment will appear here once you tick some adjustments and hit Build comment.</span>';
}

function buildComment(){
  var student = document.getElementById('studentName').value.replace(/^\s+|\s+$/g,'');
  var className = document.getElementById('className').value.replace(/^\s+|\s+$/g,'');

  var sections = [];
  for(var c=0;c<CATEGORIES.length;c++){
    var cat = CATEGORIES[c];
    var lines = [];
    for(var i=0;i<cat.items.length;i++){
      var id = cat.key + '_' + i;
      var chk = document.getElementById('chk_' + id);
      if(chk.checked){
        var freq = document.getElementById('freq_' + id).value;
        var label = cat.items[i];
        lines.push(freq ? ("- " + label + " (" + freq + ")") : ("- " + label));
      }
    }
    if(lines.length) sections.push(cat.heading + "\n" + lines.join("\n"));
  }

  var comment = "";
  if(student && className){
    comment += student + " has received adjustments in the class " + className + ".\n\n";
  }
  comment += sections.join("\n\n");

  var out = document.getElementById('output');
  if(!comment.replace(/^\s+|\s+$/g,'')){
    out.innerHTML = '<span class="placeholder">Nothing ticked yet - select at least one adjustment to build a comment.</span>';
  } else {
    out.textContent = comment;
  }
}

function copyOutput(){
  var text = document.getElementById('output').innerText || document.getElementById('output').textContent;
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){
      showCopied();
    });
  } else {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopied();
  }
}

function showCopied(){
  var status = document.getElementById('copyStatus');
  status.className = 'copy-status show';
  setTimeout(function(){ status.className = 'copy-status'; }, 1500);
}

function init(){
  renderCategories();

  // Wire up the three main buttons
  document.getElementById('btnBuild').addEventListener('click', buildComment);
  document.getElementById('btnReset').addEventListener('click', resetAll);
  document.getElementById('btnCopy').addEventListener('click', copyOutput);

  // One listener handles all checkboxes and section-clear buttons (event delegation)
  var root = document.getElementById('categories');
  root.addEventListener('change', function(e){
    var t = e.target || e.srcElement;
    if(t && t.className && String(t.className).indexOf('adj-check') !== -1){
      toggleFreq(t.getAttribute('data-item'));
    }
  });
  root.addEventListener('click', function(e){
    var t = e.target || e.srcElement;
    if(t && t.className && String(t.className).indexOf('clear-section') !== -1){
      clearCategory(t.getAttribute('data-cat'));
    }
  });
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
