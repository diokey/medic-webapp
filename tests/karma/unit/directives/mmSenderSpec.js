describe('mmSender', function() {

  'use strict';

  var compile,
      scope;

  beforeEach(function (){
    module('inboxApp');
    module('templates');
    inject(function(_$compile_, _$rootScope_) {
      compile = _$compile_;
      scope = _$rootScope_;
    });
  });

  it('should render nothing when no message', function() {
    var element = compile('<mm-sender message="message"></mm-sender>')(scope);
    scope.$digest();
    chai.expect(element.html()).to.equal('<!-- ngIf: message -->');
  });

  it('should render sender when message has from', function() {
    scope.message = {
      sent_by: '+789',
      from: '+123'
    };

    var element = compile('<mm-sender message="message"/>')(scope);
    scope.$digest();
    chai.expect(element.find('div .name').text()).to.equal('+123');
  });

  it('should render sender when message has sent by', function() {
    scope.message = {
      sent_by: '+789'
    };

    var element = compile('<mm-sender message="message"/>')(scope);
    scope.$digest();
    chai.expect(element.find('div .name').text()).to.equal('+789');
  });

  it('should render sender when message has related entities', function() {
    scope.message = {
      sent_by: '+789',
      from: '+123',
      related_entities: {
        clinic: {
          name: 'Clarks House',
          contact: {
            name: 'Clark',
            phone: '+123'
          },
          parent: {
            name: 'Smallville',
            parent: {
              name: 'Metropolis'
            }
          }
        }
      }
    };

    var element = compile('<mm-sender message="message"/>')(scope);
    scope.$digest();
    chai.expect(element.find('div .name').text()).to.equal('Clark');
    chai.expect(element.find('div .phone').text()).to.equal('+123');
    chai.expect(element.find('div .position').text()).to.equal('Clarks House › Smallville › Metropolis');
  });
});