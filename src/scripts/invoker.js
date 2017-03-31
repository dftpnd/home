;(function (){
    "use strict";

    var skillKeyMap = {},
    
        QUAS = 'q',
        WEX = 'w',
        EXORT = 'e',
        INVOKE = 'i',

        KEY_E = 69,
        KEY_Q = 81,
        KEY_R = 82,
        KEY_W = 87,

        reagents = [QUAS, WEX, EXORT],

        skillKeys = [QUAS, WEX, EXORT, INVOKE],
        
        invoker = {
            state: [QUAS, WEX, EXORT],

            get reagents() {
                return this.state.join('');
            },

            set reagents(reagent) {
                this.state.shift();
                this.state.push(reagent)
                return this.state;
            }
        },
        
        skills = {
            www: {name:'EMP', picture:'emp.png' },
            qww: {name:'Tornado', picture:'tornado.png'},
            wwe: {name:'Alacrity', picture:'alacrity.png'},
            qqw: {name:'Ghost Walk', picture:'ghost_walk.png'},
            qwe: {name:'Deafening Blast', picture:'deafening_blast.png'},
            wee: {name:'Chaos Meteor', picture:'chaos_meteor.png'},
            qqq: {name:'Cold Snap', picture:'cold_snap.png'},
            qqe: {name:'Ice Wall', picture:'ice_wall.png'},
            qee: {name:'Forge Spirit', picture:'forge_spirit.png'},
            eee: {name:'Sun Strike', picture:'sun_strike.png'},
        };

        skillKeyMap[KEY_E] = EXORT,
        skillKeyMap[KEY_Q] = QUAS,
        skillKeyMap[KEY_W] = WEX,
        skillKeyMap[KEY_R] = INVOKE;
        
        function randomSpell(){
            var skillsList = Object.keys(skills),
                minimum = 0,
                maximum = 9,
                randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            
            return skillsList[randomnumber];
        }

        function nextSpell(reagents){
            var spell = randomSpell();

           if(spell !== reagents) return spell;
            
            return nextSpell(spell);
        }
        
        function teamplateExample(data){
           return `<div class="helper">
                <div>
                    Создавай 
                    <span>${data.name}</span>
                    (<span>${data.spellCaste}</span>)
                </div>
                <div class="spell-picter">
                    <img src="/img/invoker/${data.picture}">
                </div>
                <input id="helper-value" type="hidden" value="${data.spell}">
            <div>`
        }
        
        function loadAllImage(){
            skills.forEach((skill)=>{
                console.log(skill.picture);
            });
        }
        
        loadAllImage();

        $(document).keyup(function(e) {
            var skillCode = skillKeyMap[e.keyCode];
            
            if(skillKeys.includes(skillCode))
                $('.skill[value="' + skillKeyMap[e.keyCode] + '"]').click();
        });

        $('#start').click(function(){
            var spell = nextSpell(invoker.reagents);

            $('#helper').html(teamplateExample({
                name: skills[spell].name,
                picture: skills[spell].picture,
                spell: spell,
                spellCaste: spell.toUpperCase().split('').join('-'),
            }));
        });

        $('.skill:not(.skill__invoke)').click(function(){
            var skillCode = $(this).val();
            invoker.reagents  = skillCode;

            $('#reagents :first-child').remove();
            $('#reagents')
            .append('<div class="reagent reagent__'+skillCode+'">'+skillCode.toUpperCase()+'</div>');
        });

        $('.skill__invoke').click(function(){
             if($('#helper-value').val() === invoker.reagents ) $('#start').click();

             $('#invoke-list')
             .append('<img width="40" height="40" src="/img/invoker/'+skills[invoker.reagents].picture+'" alt="'+skills[invoker.reagents].name+'">')
        });

        $('.skill').click(function(){
            $(this).addClass('clicked').delay(100).queue(function(){
                $(this).removeClass('clicked').dequeue();
            });
        });

})();
